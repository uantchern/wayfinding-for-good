// purposely-report-generator.js
// Node.js script to generate the final Week 8 HTML/PDF Report Card
// Requires: npm install @supabase/supabase-js dotenv fs
// Run: node purposely-report-generator.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase Client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const REPORT_SYSTEM_PROMPT = `You are the Senior Governance Architect tasked with generating perfectly formatted HTML content for the Week 8 PURPOSELY Board Effectiveness Report.
You will be provided with aggregated JSON statistics representing the board's 6-week "Question Storming" performance across the NVPC Charity Board Framework domains.

Your output MUST be a valid JSON object with exactly these three keys, stringified as raw HTML (use <p>, <ul>, <li>, <strong>, but NO markdown wrapping or outer ```html blocks):
    {
        "blind_spots_html": "HTML summarizing the principles where the board plateaued at operational compliance (high 'blind spot' rates).",
        "inquiry_index_html": "HTML providing a qualitative summary of their questioning culture. Are they generative or passive? Heavily focused on Oversight but weak on Strategy?",
        "action_plan_html": "HTML mapping their weakest principles to GovernWell training courses. (e.g., Principle 4 -> 'Financial Stewardship for Charities (ISCA)', Principle 5 -> 'Risk Management & Data Protection', Principle 2 -> 'Board Dynamics & Succession Planning', Principle 1/6 -> 'Strategic Planning & Value Creation')."
}

Tone Rules: "Critical Friend", professional, heavily contextualized to Singapore's charity sector. Avoid grading or scores.`;

async function fetchBoardAggregatedData(targetBoardId) {
    console.log(`Fetching 6-week evaluation data for Board: ${targetBoardId}...`);
    // Note: Due to the anonymized nature, we join evaluation_results -> director_sessions -> directors -> boards

    // In Supabase, you'll need the proper relation mappings, testing with a mock structured query
    const { data: rawEvals, error } = await supabase
        .from('evaluation_results')
        .select(`
            id,
            nvpc_advocacy,
            nvpc_oversight,
            nvpc_strategic,
            is_blind_spot,
            director_sessions (
                scenario_id,
                directors ( board_id )
            )
        `);
    // For production, strictly filter to `.eq('director_sessions.directors.board_id', targetBoardId)`

    if (error) throw error;

    // Filter out only the evals that logically belong to the target board manually for this prototype
    const boardEvals = rawEvals.filter(e => e.director_sessions?.directors?.board_id === targetBoardId);

    // Aggregate the stats
    const stats = {
        total_sessions: boardEvals.length,
        domain_tallies: { advocacy: 0, oversight: 0, strategic: 0 },
        blind_spots_by_scenario: {}
    };

    boardEvals.forEach(eval => {
        if (eval.nvpc_advocacy) stats.domain_tallies.advocacy++;
        if (eval.nvpc_oversight) stats.domain_tallies.oversight++;
        if (eval.nvpc_strategic) stats.domain_tallies.strategic++;

        const sId = eval.director_sessions.scenario_id;
        if (!stats.blind_spots_by_scenario[sId]) stats.blind_spots_by_scenario[sId] = { total: 0, blind_spots: 0 };

        stats.blind_spots_by_scenario[sId].total++;
        if (eval.is_blind_spot) stats.blind_spots_by_scenario[sId].blind_spots++;
    });

    return stats;
}

async function generateReportWithLLM(aggregatedStats) {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");

    const payload = {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: REPORT_SYSTEM_PROMPT },
            { role: "user", content: `Here is the aggregated NVPC statistical data for the board over 6 weeks:\n${JSON.stringify(aggregatedStats, null, 2)}` }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return JSON.parse(data.choices[0].message.content);
}

function buildHtmlReport(llmData) {
    // Generate a beautiful, modern, printable HTML template
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PURPOSELY - Board Effectiveness Report Card</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --surface-color: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8;
            --accent-glow: rgba(56, 189, 248, 0.4);
            --danger: #fb7185;
            --border: #334155;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 40px;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: var(--surface-color);
            border-radius: 16px;
            padding: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            border: 1px solid var(--border);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid var(--border);
            padding-bottom: 30px;
            margin-bottom: 40px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            letter-spacing: -1px;
            color: var(--text-main);
        }
        .header p {
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        .section {
            margin-bottom: 40px;
            padding: 30px;
            background: rgba(15, 23, 42, 0.5);
            border-radius: 12px;
            border-left: 4px solid var(--accent);
        }
        .section.danger { border-left-color: var(--danger); }
        .section h2 {
            margin-top: 0;
            font-size: 1.5rem;
            color: var(--text-main);
            display: flex;
            align-items: center;
        }
        .section h2::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--accent);
            margin-right: 12px;
            box-shadow: 0 0 10px var(--accent-glow);
        }
        .section.danger h2::before { background: var(--danger); box-shadow: 0 0 10px rgba(251, 113, 133, 0.4); }
        p { color: var(--text-muted); }
        li { color: var(--text-muted); margin-bottom: 8px; }
        strong { color: var(--text-main); }
        .footer {
            text-align: center;
            margin-top: 50px;
            font-size: 0.85rem;
            color: var(--text-muted);
            opacity: 0.7;
        }
        @media print {
            body { background: white; color: black; padding: 0; }
            .container { background: transparent; border: none; box-shadow: none; padding: 20px; }
            p, li { color: #333; }
            strong { color: #000; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Week 8 Report Card</h1>
            <p>PURPOSELY Question Storming Module &bull; NVPC Board Evaluation</p>
        </div>
        
        <div class="section danger">
            <h2>1. Collective Blind Spots</h2>
            ${llmData.blind_spots_html}
        </div>

        <div class="section">
            <h2>2. The Inquiry Index</h2>
            ${llmData.inquiry_index_html}
        </div>

        <div class="section">
            <h2>3. Recommended Action Plan</h2>
            ${llmData.action_plan_html}
        </div>

        <div class="footer">
            Generated autonomously via the PURPOSELY platform. Data anonymized in compliance with Singapore PDPA protocols.
        </div>
    </div>
</body>
</html>
    `;
}

async function runReportGenerator(boardId) {
    try {
        console.log("==========================================");
        console.log(" PURPOSELY REPORT GENERATOR RUNNING");
        console.log("==========================================\n");

        /* IN A REAL ENVIRONMENT YOU WOULD CALL:
        const stats = await fetchBoardAggregatedData(boardId);
        
        BUT FOR PROTOTYPING, WE WILL MOCK THE AGGREGATED STATS 
        TO PROVE THE JSON LLM LOGIC:
        */
        const mockStats = {
            total_sessions: 48, // 8 directors * 6 wks
            domain_tallies: { advocacy: 10, oversight: 35, strategic: 3 },
            blind_spots_by_scenario: {
                "1_mission": { total: 8, blind_spots: 1 },
                "2_succession": { total: 8, blind_spots: 6 }, // High failure to ask complex questions
                "4_finance": { total: 8, blind_spots: 5 }     // High failure to look past operations
            }
        };

        console.log("1. Mapped Evaluator Statistics. Pushing to LLM...");
        const mappedJson = await generateReportWithLLM(mockStats);

        console.log("2. HTML payload received from Assistant. Assembling document...");
        const finalHtml = buildHtmlReport(mappedJson);

        const outPath = path.join(__dirname, 'purposely_report_card.html');
        fs.writeFileSync(outPath, finalHtml);

        console.log(`\n✅ REPORT SUCCESSFULLY GENERATED!`);
        console.log(`Open this file in your browser or print to PDF:`);
        console.log(`file:///${outPath.replace(/\\/g, '/')}`);

    } catch (err) {
        console.error("Critical error in Report Generator:", err);
    }
}

// Replace with target Board UUID
runReportGenerator("mocked-board-id-1234");
