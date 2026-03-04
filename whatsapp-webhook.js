// whatsapp-webhook.js
// Node.js Express server to handle incoming WhatsApp messages, manage state via Supabase, and trigger OpenAI.
// Requires: npm install express body-parser @supabase/supabase-js crypto dotenv
// Run: node whatsapp-webhook.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

// Initialize Supabase Client
// IMPORTANT: Use the SERVICE_ROLE key to bypass RLS policies for PDPA strict isolation
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Constants
const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Helper: Send message back to WhatsApp
async function sendWhatsAppMessage(toHashPlaceholder, messageBody) {
    // Note: In production, since you only store the hash, you must either:
    // A) Send the reply seamlessly within the webhook HTTP response (if using Twilio).
    // B) E2E encrypt the raw phone number inside a temporary cache that expires after the assessment pulse, 
    //    so you can map returning hashes to actual delivery numbers. 
    // For this prototype, we assume we have the raw 'to' number mapped safely in-session.

    // Example: Facebook/Meta Cloud API format
    console.log(`\n[WHATSAPP OUTBOX] -> ${messageBody}\n`);
    /*
    await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: toHashPlaceholder, text: { body: messageBody } })
    });
    */
}

// Helper: Call OpenAI Challenger Prompt
async function generateAIChallenge(dilemmaText, stageLogic, directorInput) {
    const systemPrompt = `You are a Senior Governance Architect acting as a 'Critical Friend' to a charity board director in Singapore. 
    Review the scenario dilemma, apply the specific challenge logic, and push back on the director's question. 
    Keep it under 80 words. Adopt a WhatsApp-friendly tone. Ask ONE challenging follow-up question. Do NOT grade them.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `SCENARIO: ${dilemmaText}\nCHALLENGE RULE: ${stageLogic}\nDIRECTOR'S QUESTION: "${directorInput}"` }
            ]
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

// Webhook Verification (for Meta API Setup)
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === "PURPOSELY_SECURE_TOKEN") {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

// Incoming Message Handler
app.post('/webhook', async (req, res) => {
    console.log("Receiving Webhook Event...");
    res.sendStatus(200); // Immediately acknowledge receipt to WhatsApp to prevent retries

    try {
        // Parse WhatsApp Message payload (Assuming Meta Cloud API structure)
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (!messages || messages.length === 0) return;

        const incomingMsg = messages[0];
        const rawPhoneNumber = incomingMsg.from; // The sender's raw phone number
        const directorInput = incomingMsg.text?.body;

        if (!directorInput) return; // Only process text for this prototype

        // 1. ANONYMIZATION: Hash the Phone Number for PDPA
        const whatsappHash = crypto.createHash('sha256').update(rawPhoneNumber).digest('hex');

        // 2. Lookup Director Identity
        let { data: director } = await supabase.from('directors').select('id').eq('whatsapp_hash', whatsappHash).single();
        if (!director) {
            console.log("Unknown sender. Ensure the director is registered.");
            return;
        }

        // 3. Find Global Active Scenario State
        let { data: session } = await supabase.from('director_sessions')
            .select('*, weekly_scenarios(dilemma_text)')
            .eq('director_id', director.id)
            .is('completed_at', null)
            .single();

        if (!session) {
            await sendWhatsAppMessage(rawPhoneNumber, "You have no active Question Storming scenarios pending for this week. Look out for the next one!");
            return;
        }

        const stage = session.current_stage; // 1, 2, 3, or 4
        const dilemmaText = session.weekly_scenarios.dilemma_text;

        // 4. State Machine Routing
        if (stage >= 1 && stage <= 3) {
            // Determine which logic rule to apply based on stage (1: Relevance, 2: Fiduciary, 3: Strategy)
            const challengeRules = {
                1: "Challenge 1 (Relevance): Challenge them to ensure the issue strictly aligns with the core objects and constitution.",
                2: "Challenge 2 (Fiduciary Duty): Challenge them on how this protects assets, reputation, and mitigates immediate legal risk.",
                3: "Challenge 3 (Strategy): Challenge them to look 5-10 years ahead. How does this impact IPC renewal and long-term sustainability?"
            };

            const stageLogic = challengeRules[stage];

            // Trigger OpenAI
            console.log(`Processing Stage ${stage} logic for Director ID: ${director.id}`);
            const aiPushback = await generateAIChallenge(dilemmaText, stageLogic, directorInput);

            // Log transcript to Supabase
            await supabase.from('session_transcripts').insert({
                session_id: session.id,
                turn_number: stage,
                director_input: directorInput,
                ai_pushback: aiPushback
            });

            // Update State
            await supabase.from('director_sessions')
                .update({ current_stage: stage + 1 })
                .eq('id', session.id);

            // Send standard response + the new dilemma prompt to WhatsApp
            let outgoingMessage = aiPushback;
            if (stage === 3) {
                outgoingMessage += "\n\n*(This concludes the iteration. Please reply with your Final Thoughts on how you will approach this topic moving forward.)*";
            }
            await sendWhatsAppMessage(rawPhoneNumber, outgoingMessage);

        } else if (stage === 4) {
            // Final Thoughts Stage
            console.log("Processing Final Thoughts...");

            // Log Final Transcript
            await supabase.from('session_transcripts').insert({
                session_id: session.id,
                turn_number: 4,
                director_input: directorInput,
                ai_pushback: null // No pushback on the final thought
            });

            // Mark completed
            await supabase.from('director_sessions')
                .update({ current_stage: 5, completed_at: new Date() })
                .eq('id', session.id);

            await sendWhatsAppMessage(rawPhoneNumber, "Thank you for completing this week's governance pulse! Your responses have been anonymized and logged. Have a great week ahead.");

            // TODO: Trigger asynchronous NVPC Categorization Evaluation here
            // (Pass the entire transcript to LLM, parse JSON, store in `evaluation_results` table)
        }

    } catch (err) {
        console.error("Webhook processing error:", err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PURPOSELY webhook server listening on port ${PORT}`);
});
