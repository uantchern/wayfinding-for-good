const ecosystemData = {
    "nodes": [
        { "id": "dom_social", "name": "Social & Human Services", "group": "Top-Level Domain", "val": 10, "description": "Sector focusing on marginalized groups, families, elderly, and those needing social assistance." },
        { "id": "dom_health", "name": "Health & Healthcare", "group": "Top-Level Domain", "val": 10, "description": "The ecosystem of charities, hospitals, and VWOs focused on physical and mental well-being in Singapore." },
        { "id": "dom_edu", "name": "Education", "group": "Top-Level Domain", "val": 10, "description": "Organizations dedicated to advancing knowledge, schools, and academic scholarships." },
        { "id": "dom_arts", "name": "Arts/Culture/Heritage", "group": "Top-Level Domain", "val": 8, "description": "Preservation of culture, arts groups, museums, and historical heritage." },
        { "id": "dom_religion", "name": "Religion", "group": "Top-Level Domain", "val": 8, "description": "Faith-based organizations, places of worship, and religiously motivated charitable groups." },
        { "id": "dom_env", "name": "Environment & Animal Welfare", "group": "Top-Level Domain", "val": 8, "description": "Protection of nature, sustainability tracking, and animal rescue and care." },
        { "id": "dom_community", "name": "Community & Citizenship", "group": "Top-Level Domain", "val": 8, "description": "Fostering community bonds, active citizenry, and neighborhood groups." },
        { "id": "dom_sports", "name": "Sports", "group": "Top-Level Domain", "val": 8, "description": "Promotion of sports excellence, fitness inclusion, and athletic development." },
        { "id": "dom_advocacy", "name": "Advocacy", "group": "Top-Level Domain", "val": 8, "description": "Think-tanks and advocacy groups driving particular causes and public awareness." },

        { "id": "reg_coc", "name": "Commissioner of Charities (COC)", "group": "Stakeholders & Regulators", "val": 9, "description": "The principal regulator of charities in Singapore. Oversees the Charities Act and promotes governance." },
        { "id": "reg_mccy", "name": "Ministry of Culture, Community and Youth (MCCY)", "group": "Stakeholders & Regulators", "val": 9, "description": "The ministry housing the COC and driving policies related to community, arts, and charities." },
        { "id": "reg_council", "name": "Charity Council", "group": "Stakeholders & Regulators", "val": 7, "description": "An independent body appointed to promote good governance and publish the Code of Governance." },
        { "id": "reg_moe", "name": "MOE", "group": "Stakeholders & Regulators", "val": 8, "description": "Ministry of Education. Sector administrator for educational charities." },
        { "id": "reg_moh", "name": "MOH", "group": "Stakeholders & Regulators", "val": 8, "description": "Ministry of Health. Sector administrator for healthcare charities." },
        { "id": "reg_msf", "name": "MSF", "group": "Stakeholders & Regulators", "val": 8, "description": "Ministry of Social and Family Development. Sector administrator for social service agencies." },
        { "id": "reg_pa", "name": "People's Association (PA)", "group": "Stakeholders & Regulators", "val": 7, "description": "Sector administrator for community and citizenship organizations." },
        { "id": "reg_sportsg", "name": "SportSG", "group": "Stakeholders & Regulators", "val": 7, "description": "Sector administrator for sports-related charities and organizations." },

        { "id": "eco_ncss", "name": "NCSS", "group": "Ecosystem Players", "val": 8, "description": "National Council of Social Service. The umbrella body for social service agencies." },
        { "id": "eco_tote", "name": "Tote Board", "group": "Ecosystem Players", "val": 8, "description": "A statutory board channelling gaming revenue back into the community via grants and funding." },
        { "id": "eco_temasek", "name": "Temasek Foundation", "group": "Ecosystem Players", "val": 7, "description": "A philanthropic organization driving social infrastructure and resilience." },
        { "id": "eco_chest", "name": "Community Chest", "group": "Ecosystem Players", "val": 7, "description": "The fund-raising and engagement arm of NCSS. Channels raised funds to agencies." },
        { "id": "eco_giving", "name": "Giving.sg", "group": "Ecosystem Players", "val": 6, "description": "The national platform for donating, volunteering, and fundraising in Singapore." },

        { "id": "grant_ccf", "name": "VWO-Charities Capability Fund (CCF)", "group": "Grants & Funding Nodes", "val": 6, "description": "Funding to enhance governance, management, and operational efficiency of charities." },
        { "id": "grant_tote_ssf", "name": "Tote Board Social Service Fund", "group": "Grants & Funding Nodes", "val": 6, "description": "Critical broad-based funding for social service programmes." },
        { "id": "grant_tech_go", "name": "Tech-and-GO!", "group": "Grants & Funding Nodes", "val": 5, "description": "A specialized grant by NCSS enabling agencies to adopt technology and digitalize." },
        { "id": "grant_sg60", "name": "SG60 Matching Grants", "group": "Grants & Funding Nodes", "val": 5, "description": "Dollar-for-dollar matching programs rolled out to spur localized giving." },

        { "id": "iss_ipc", "name": "IPC Status", "group": "Governance & Issues Nodes", "val": 6, "description": "Institutions of a Public Character. Allows donors to receive tax deductions." },
        { "id": "iss_act", "name": "Charities Act", "group": "Governance & Issues Nodes", "val": 5, "description": "The overarching legislation dictating compliance, registration, and reporting." },
        { "id": "iss_digi", "name": "Digitalisation", "group": "Governance & Issues Nodes", "val": 5, "description": "The challenge and journey of moving paper-based operations into the cloud." },
        { "id": "iss_transp", "name": "Transparency", "group": "Governance & Issues Nodes", "val": 5, "description": "A core tenet pushed by the Charity Council to build donor trust." },
        { "id": "iss_founder", "name": "Founder Syndrome", "group": "Governance & Issues Nodes", "val": 4, "description": "An organizational challenge where a founder maintains disproportionate power and influence." },
        { "id": "iss_esg", "name": "ESG", "group": "Governance & Issues Nodes", "val": 4, "description": "Environmental, Social, and Governance criteria that charities are increasingly adopting." }
    ],
    "links": [
        { "source": "dom_social", "target": "reg_msf", "relation": "Sector Administrator" },
        { "source": "reg_msf", "target": "eco_ncss", "relation": "Oversees" },
        { "source": "eco_ncss", "target": "eco_chest", "relation": "Parent Body" },
        { "source": "eco_ncss", "target": "grant_tech_go", "relation": "Administers" },

        { "source": "dom_health", "target": "reg_moh", "relation": "Sector Administrator" },
        { "source": "reg_moh", "target": "eco_ncss", "relation": "Collaborates" },

        { "source": "dom_edu", "target": "reg_moe", "relation": "Sector Administrator" },
        { "source": "dom_arts", "target": "reg_mccy", "relation": "Sector Administrator" },
        { "source": "dom_community", "target": "reg_pa", "relation": "Sector Administrator" },
        { "source": "dom_sports", "target": "reg_sportsg", "relation": "Sector Administrator" },

        { "source": "reg_mccy", "target": "reg_coc", "relation": "Houses" },
        { "source": "reg_coc", "target": "reg_council", "relation": "Appoints" },
        { "source": "reg_coc", "target": "iss_act", "relation": "Enforces" },
        { "source": "reg_coc", "target": "iss_ipc", "relation": "Approves" },

        { "source": "reg_council", "target": "iss_transp", "relation": "Promotes" },
        { "source": "reg_council", "target": "grant_ccf", "relation": "Fund Source" },
        { "source": "grant_ccf", "target": "iss_transp", "relation": "Supports Capacity Building" },

        { "source": "eco_tote", "target": "grant_tote_ssf", "relation": "Provides" },
        { "source": "eco_tote", "target": "eco_ncss", "relation": "Key Funder" },
        { "source": "eco_tote", "target": "reg_mccy", "relation": "Reports to" },

        { "source": "eco_temasek", "target": "dom_social", "relation": "Funder" },
        { "source": "eco_giving", "target": "reg_coc", "relation": "Regulated under" },

        { "source": "iss_ipc", "target": "dom_health", "relation": "Highly Sough After" },
        { "source": "iss_ipc", "target": "dom_social", "relation": "Highly Sough After" },

        { "source": "grant_tech_go", "target": "iss_digi", "relation": "Solves" },
        { "source": "dom_advocacy", "target": "iss_founder", "relation": "Common Pitfall" },
        { "source": "dom_env", "target": "iss_esg", "relation": "Champion" },
        { "source": "dom_social", "target": "iss_founder", "relation": "Common Pitfall" },
        { "source": "eco_temasek", "target": "iss_esg", "relation": "Strategic Pillar" }
    ],
    "logs": {
        "grant_tech_go": [
            { "id": "log_1", "author": "Agency Admin", "date": "2025-11-12", "comment": "The approval process took about 3 months. Ensure your vendor proposals are finalized before applying." },
            { "id": "log_2", "author": "Digital Consultant", "date": "2026-01-05", "comment": "Great resources for smaller charities looking to implement a CRM system." }
        ],
        "iss_founder": [
            { "id": "log_3", "author": "Sector Observer", "date": "2025-08-22", "comment": "Crucial to have independent board members to mitigate this risk early on." },
            { "id": "log_4", "author": "VWO Board Member", "date": "2026-02-10", "comment": "We utilized the CCF grant to bring in external consultants to facilitate leadership transition. Highly recommend." }
        ],
        "iss_ipc": [
            { "id": "log_5", "author": "Fundraising Exec", "date": "2025-10-01", "comment": "Donors almost always ask for IPC status. If you are new, plan a 2-year roadmap to achieve it." }
        ]
    }
};

window.ecosystemData = ecosystemData;
