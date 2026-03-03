// purposely-evaluator.js
// Node.js Background Worker to evaluate completed Question Storming sessions.
// Designed to run asynchronously (e.g., via a Cron job) to prevent blocking the WhatsApp Webhook.
// Requires: npm install @supabase/supabase-js dotenv
// Run: node purposely-evaluator.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// The AI Prompt strictly defining the JSON Schema required for the database
const EVALUATOR_SYSTEM_PROMPT = `You are a Senior Governance Architect evaluating an anonymized charity director's responses to a dilemma.
Review their 3 iterative questions and their final reflective statement. 

Categorize their overall questioning approach using the NVPC Charity Board Performance Framework.
Do NOT assign a numerical score. You MUST respond with ONLY a valid, parseable JSON object. No markdown wrapping.
The JSON object must have exactly these keys:
{
  "nvpc_advocacy": boolean, // Focus on external networks, public perception, donors, mission championing
  "nvpc_oversight": boolean, // Focus on legal, fiduciary risk, compliance, internal controls
  "nvpc_strategic": boolean, // Focus on long-term sustainability, succession, innovation, systemic change
  "is_blind_spot": boolean, // True if the director plateaued at basic operational level and failed to elevate to governance/board level concerns
  "evaluator_reasoning": "string" // A brief, 50-word qualitative explanation of why they leaned toward these domains
}`;

async function callEvaluatorLLM(transcriptText) {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY environment variable is not set.");

    const payload = {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: EVALUATOR_SYSTEM_PROMPT },
            { role: "user", content: `Here is the full session transcript for evaluation:\n\n${transcriptText}` }
        ],
        temperature: 0.2, // Low temperature for consistent JSON structural adherence
        response_format: { type: "json_object" } // Force strict JSON parsing
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    // Parse the JSON string from OpenAI
    try {
        const jsonResult = JSON.parse(data.choices[0].message.content);
        return jsonResult;
    } catch (e) {
        throw new Error("Failed to parse OpenAI response as JSON: " + data.choices[0].message.content);
    }
}

async function runEvaluatorJob() {
    console.log("Starting PURPOSELY Background Evaluator Job...");

    try {
        // 1. Fetch all completed sessions (current_stage = 5)
        // We use a query to check if they ALREADY exist in evaluation_results to avoid double passing
        const { data: completedSessions, error: sessionErr } = await supabase
            .from('director_sessions')
            .select(`
                id, 
                current_stage,
                evaluation_results ( id )
            `)
            .eq('current_stage', 5);

        if (sessionErr) throw sessionErr;

        // Filter for sessions that do not have an evaluation yet
        const pendingSessions = completedSessions.filter(s => !s.evaluation_results || s.evaluation_results.length === 0);

        console.log(`Found ${pendingSessions.length} completed sessions pending NVPC categorization.\n`);

        for (const session of pendingSessions) {
            console.log(`Evaluating Session ID: ${session.id}...`);

            // 2. Fetch the 4 transcript turns for this session
            const { data: transcripts, error: transcriptErr } = await supabase
                .from('session_transcripts')
                .select('turn_number, director_input, ai_pushback')
                .eq('session_id', session.id)
                .order('turn_number', { ascending: true });

            if (transcriptErr) throw transcriptErr;
            if (!transcripts || transcripts.length === 0) {
                console.log(`Skipping: No transcript data found for session ${session.id}`);
                continue;
            }

            // 3. Construct a readable transcript for the LLM
            let compiledTranscript = "";
            transcripts.forEach(t => {
                if (t.turn_number < 4) {
                    compiledTranscript += `[Stage ${t.turn_number} Q]: "${t.director_input}"\n`;
                    compiledTranscript += `[AI Challenge Pushback]: "${t.ai_pushback}"\n\n`;
                } else {
                    compiledTranscript += `[Stage 4 Final Thoughts]: "${t.director_input}"\n`;
                }
            });

            // 4. Call the LLM to get the JSON Evaluation
            try {
                const evalData = await callEvaluatorLLM(compiledTranscript);

                // 5. Insert directly into Supabase 'evaluation_results' table
                const { error: insertErr } = await supabase
                    .from('evaluation_results')
                    .insert({
                        session_id: session.id,
                        nvpc_advocacy: evalData.nvpc_advocacy,
                        nvpc_oversight: evalData.nvpc_oversight,
                        nvpc_strategic: evalData.nvpc_strategic,
                        is_blind_spot: evalData.is_blind_spot,
                        evaluator_reasoning: evalData.evaluator_reasoning
                    });

                if (insertErr) {
                    console.error(`Failed to insert evaluation for session ${session.id}:`, insertErr.message);
                } else {
                    console.log(`✅ Categorization Complete for Session ${session.id}`);
                    console.log(`   └─ Advocacy: ${evalData.nvpc_advocacy} | Oversight: ${evalData.nvpc_oversight} | Strategic: ${evalData.nvpc_strategic} | Blind Spot: ${evalData.is_blind_spot}`);
                }
            } catch (llmError) {
                console.error(`LLM Error for session ${session.id}:`, llmError.message);
            }
        }

        console.log("\nBatch complete. Shutting down worker.");

    } catch (err) {
        console.error("Critical error in Evaluator job:", err);
    }
}

// Execute the worker job
runEvaluatorJob();
