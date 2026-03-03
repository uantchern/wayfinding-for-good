// test-purposely-prompts.js
// Run this script using: `node test-purposely-prompts.js`
// Make sure to set your OpenAI API key as an environment variable first: 
// Windows (PowerShell): $env:OPENAI_API_KEY="your-api-key"
// Mac/Linux: export OPENAI_API_KEY="your-api-key"

const SCENARIOS = [
    {
        id: 1,
        title: "Mission & Objectives (Mission Drift)",
        dilemma: "The charity (an IPC focused on elderly care) is offered a highly lucrative $500,000 restricted grant from a major corporate donor. However, the strict grant stipulations require the charity to allocate 40% of the funds to launch a brand-new youth mentorship program. The management team is eager to accept, arguing the remaining funds will help cover operational overheads and that 'youth mentorship loosely aligns with community building.' Accepting the grant would require diverting significant staff time and resources away from your core objects of elderly care. The donor requires an immediate answer.",
        challenges: [
            "Challenge 1 (Relevance): Analyze the director's question. Does it directly address whether the new youth program aligns with the charity's constitution and registered objects with the Commissioner of Charities? If not, challenge them to refocus on whether we are stretching our legal mandate just for funding.",
            "Challenge 2 (Fiduciary Duty): Analyze the director's new question. Does it address the protection of current assets and beneficiaries? Challenge them on resource allocation: how to press management on the risk of overstretching staff and neglecting the elderly beneficiaries who currently depend on us.",
            "Challenge 3 (Strategy): Push them toward long-term impact on the charity's sector positioning. Ask how they would question the long-term strategic risk, specifically the threat to our IPC status renewal and credibility if we lose focus on our core expertise over the next 5 years."
        ]
    },
    {
        id: 5,
        title: "Accountability & Transparency (Data Breach)",
        dilemma: "During a routine review, an IT vendor informs the Executive Director that a database server containing sensitive personal and financial data of over 2,000 donors and beneficiaries was inadvertently exposed online for three weeks. There is currently no active evidence of data exfiltration, but server logs are inconclusive. The Executive Director suggests quietly patching the vulnerability and 'handling it internally' without formally notifying the Board or the Personal Data Protection Commission (PDPC). They argue that a public disclosure would cause unnecessary panic and severely jeopardize upcoming year-end fundraising campaigns.",
        challenges: [
            "Challenge 1 (Relevance): Does the director's question challenge the conflict between short-term optics and true accountability? Challenge them on whether 'handling it internally' truly serves our mission of accountability, versus simply prioritizing short-term comfort over our beneficiaries' trust.",
            "Challenge 2 (Fiduciary Duty): Does the question address the legal and statutory risks under Singapore law? Refine their question to specifically challenge the ED on the severe legal and fiduciary risks of ignoring statutory reporting requirements under the PDPA, regardless of the fundraising impact.",
            "Challenge 3 (Strategy): Move the conversation from incident response to systemic governance. Challenge them to ask a question that ensures this incident fundamentally reforms our strategic approach to cybersecurity governance and long-term risk management."
        ]
    }
    // Add Scenarios 2, 3, 4, 6 here as needed from the markdown documentation for full calibration
];

// Core System Prompt for the AI Challenger
const SYSTEM_PROMPT = `You are the Senior Governance Architect acting as a 'Critical Friend' to a charity board director in Singapore. 
Your tone must be professional, demanding but polite, and deeply contextualized to Singapore's charity sector (Commissioner of Charities, IPC regulations, PDPA, NCSS Code of Governance).

You will be given:
1. The Scenario Dilemma the director just read.
2. The specific AI Challenge Logic rule for this turn (Stage 1, 2, or 3).
3. The director's attempted question.

Your task is to analyze their question and push back EXACTLY according to the current Challenge logic rule. 
Keep your response under 80 words. Adopt a conversational WhatsApp-friendly tone. Ask EXACTLY ONE challenging follow-up question in return. Do NOT grade or praise them excessively. Challenge them to think deeper.`;

async function callLLM(dilemma, challengeLogic, directorInput) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY environment variable is not set. Please set it before running this script.");
    }

    const payload = {
        model: "gpt-4o-mini", // Or gpt-4o for highest quality
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `SCENARIO DILEMMA:\n${dilemma}\n\nCURRENT TURN CHALLENGE LOGIC:\n${challengeLogic}\n\nDIRECTOR'S QUESTION:\n"${directorInput}"` }
        ],
        temperature: 0.7,
        max_tokens: 150
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
}

// -------------------------------------------------------------
// MOCK CALIBRATION TEST
// -------------------------------------------------------------
async function runCalibrationTest() {
    console.log("==================================================");
    console.log("   PURPOSELY - AI PROMPT CALIBRATION SUITE");
    console.log("==================================================\n");

    const activeScenario = SCENARIOS[0]; // Testing Scenario 1: Mission Drift
    console.log(`[SCENARIO LOADED]: ${activeScenario.title}\n`);

    // Simulated Inputs from a Director
    const simulatedDirectorInputs = [
        "I would ask the CEO why the donor is forcing us into youth mentorship when they know we do elderly care?", // Turn 1 (Basic)
        "Okay, I'd ask if we have the physical space to legally host a youth mentorship program alongside the elderly.", // Turn 2 (Slightly better, but operational)
        "Would I ask how this affects our financial reserves if the grant runs out after a year?" // Turn 3 (Financial, but still missing the extreme long-term strategy)
    ];

    for (let i = 0; i < 3; i++) {
        const stage = i + 1;
        const currentChallengeLogic = activeScenario.challenges[i];
        const directorInput = simulatedDirectorInputs[i];

        console.log(`\n--- STAGE ${stage} (Logic: ${currentChallengeLogic.split(':')[0]}) ---`);
        console.log(`> DIRECTOR'S INPUT: "${directorInput}"`);
        console.log(`... AI is thinking ...\n`);

        try {
            const aiResponse = await callLLM(activeScenario.dilemma, currentChallengeLogic, directorInput);
            console.log(`> AI CHALLENGER RESPONSE:\n"${aiResponse}"\n`);
        } catch (error) {
            console.error(`[API ERROR]: ${error.message}`);
            console.log("Make sure you set your OPENAI_API_KEY environment variable.");
            return;
        }
    }

    console.log("==================================================");
    console.log("Calibration complete. Adjust the SYSTEM_PROMPT string in this file to tweak the tone.");
}

runCalibrationTest();
