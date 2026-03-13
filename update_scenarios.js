const fs = require('fs');
const file = 'c:/Users/uloh/Dropbox/Fail on Purpose/Vibes/wayfinding-for-good/purposely-simulator.html';
let content = fs.readFileSync(file, 'utf8');

// The new scenarios object
const newScenarios = \        const scenarios = {
            "1": {
                title: "Principle 1: The charity serves its mission and achieves its objectives.",
                pool: [
                    { dilemma: "A corporate donor offers your {charityType} a $500k restricted grant, but stipulations require diverting 40% of funds to launch an unrelated youth mentorship program. The management team is eager to accept, but it fundamentally distracts from your core mission.", gec: "CODE ID 1.1: Clearly state the charitable purposes and include the objectives in the charity's governing instrument." },
                    { dilemma: "A prominent board member proposes changing your {charityType} main focus to jump on a new trending social cause that attracts easy funding, effectively abandoning your legacy beneficiaries.", gec: "CODE ID 1.2: Develop and implement strategic plans to achieve the stated charitable purposes." },
                    { dilemma: "The Executive Director of your {charityType} has quietly started expanding operations overseas without board approval, arguing that the local mission is 'already fulfilled'.", gec: "CODE ID 1.3: Have the Board review the charity's strategic plans regularly to ensure that the charity is achieving its charitable purposes." },
                    { dilemma: "A major shift in government policy renders your {charityType} main program less effective, yet the management refuses to evaluate new ways of operating because 'this is how we have always done it'.", gec: "CODE ID 1.4: The Board should ensure that the charity's activities continue to be relevant and aligned with its objectives." }
                ]
            },
            "2": {
                title: "Principle 2: The charity has an effective Board and Management.",
                pool: [
                    { dilemma: "The Board Chair of your {charityType} has served for 12 years and firmly resists stepping down, citing a 'lack of ready successors'. Key independent directors are frustrated and threatening to resign over the stagnant leadership.", gec: "CODE ID 2.8: The Board should have a maximum term limit of 10 consecutive years for the Board members. If retained, the Board should document the reasons." },
                    { dilemma: "It is discovered that three of the eight board members of your {charityType} have missed over 50% of meetings in the last two years, yet the Chair refuses to ask them to step down because they are 'well connected'.", gec: "CODE ID 2.5: The Board should conduct regular meetings with a quorum to effectively oversee the management of the charity." },
                    { dilemma: "The board of your {charityType} consists entirely of close friends of the founder, lacking crucial skills in finance, legal, and digital strategy. They govern primarily by rubber-stamping the founder's decisions.", gec: "CODE ID 2.2: The Board should ensure that there is an appropriate mix of core competencies and diversity on the Board to fulfill its roles and responsibilities." },
                    { dilemma: "The Chairman of your {charityType} also actively serves as the Executive Director and CEO, granting them total control without any independent checks.", gec: "CODE ID 2.1: The roles of the Chairman and the head of management must be separate to maintain a balance of power." },
                    { dilemma: "When a new director is appointed to your {charityType}, there is no formal letter of appointment or onboarding document explaining their fiduciary duties, leaving them confused about their operational role.", gec: "CODE ID 2.3: Provide new Board members with a formal letter of appointment and induction on their roles and responsibilities." },
                    { dilemma: "During the annual general meeting, it is noted that the Board has never conducted any form of self-evaluation or performance review for its members over the past five years.", gec: "CODE ID 2.4: The Board should evaluate its performance and effectiveness regularly, at least once every term or every 3 years." },
                    { dilemma: "A board committee takes it upon itself to approve a massive IT overhaul contract without referring back to the main Board, bypassing standard corporate governance protocols.", gec: "CODE ID 2.6: The Board may delegate its authority to Board committees, but the Board retains ultimate responsibility." },
                    { dilemma: "Your {charityType} operates without a clear set of documented terms of reference for any of its sub-committees, causing overlapping decisions on finance and HR.", gec: "CODE ID 2.7: Document the terms of reference for all Board committees." },
                    { dilemma: "There is no formal succession plan established for the aging leadership of your {charityType}, posing a massive operational risk should the CEO retire abruptly.", gec: "CODE ID 2.9: The Board should plan for succession to key positions in the Board and management." },
                    { dilemma: "The staff turnover is incredibly high, yet the Board considers HR management strictly an 'operational' issue and refuses to review the management's deeply flawed employee retention strategy.", gec: "CODE ID 2.10: The Board should exercise oversight over the recruitment, evaluation and compensation of the management." }
                ]
            },
            "3": {
                title: "Principle 3: The charity acts responsibly, fairly and with integrity.",
                pool: [
                    { dilemma: "The Executive Director of your {charityType} awarded a lucrative contract to a vendor firm owned by his brother-in-law without a tender. Although the price was competitive, no conflict of interest was officially declared.", gec: "CODE ID 3.2: There are documented procedures for Board members and staff to declare actual or potential conflicts of interest to the Board at the earliest opportunity." },
                    { dilemma: "A board member of your {charityType} silently votes to approve a massive office relocation, failing to disclose they own the new building being leased.", gec: "CODE ID 3.1: Board members should not vote or participate in decision-making on matters where they have a conflict of interest." },
                    { dilemma: "Your {charityType} accepts a huge anonymous donation from a shell company discovered to be linked to a controversial industry that fundamentally conflicts with the charity's values.", gec: "CODE ID 3.3: The Board ensures no person in a position to influence the charity's decisions derives any unfair or improper advantage." },
                    { dilemma: "A staff member is found using charity funds to host private dinners for their family, but the Board writes it off as a simple 'accounting error'.", gec: "CODE ID 3.4: Establish a code of conduct for Board members, staff, and volunteers." },
                    { dilemma: "Your {charityType} regularly receives expensive corporate gifts from major vendors during holidays, but there is no policy indicating what staff should do with them.", gec: "CODE ID 3.5: Implement policies to guide Board members, staff, and volunteers on accepting gifts and favors." },
                    { dilemma: "A significant error in the past year's charity tax returns goes entirely unreported because there is no procedure for raising compliance matters to the regulators or the board.", gec: "CODE ID 3.6: Ensure the charity complies with all applicable laws and regulations." }
                ]
            },
            "4": {
                title: "Principle 4: The charity is well-managed and plans for the future.",
                pool: [
                    { dilemma: "Your {charityType} runs entirely on yearly government grants and currently maintains zero financial reserves. A sudden policy change delays the next grant disbursement by 6 months, leaving the charity unable to make payroll next week.", gec: "CODE ID 4.1: The Board should establish and disclose a reserves policy. The reserves level should be regularly reviewed." },
                    { dilemma: "The finance manager of your {charityType} has been single-handedly approving all expenses without dual signatories for two years, and an internal audit reveals $50,000 in 'unexplained' miscellaneous spending.", gec: "CODE ID 4.4: The Board ensures that internal controls are in place with documented procedures for financial matters in key areas." },
                    { dilemma: "Your {charityType} decides to invest 80% of its cash reserves into a high-risk crypto-currency fund, promising double-digit returns to quickly solve a funding deficit.", gec: "CODE ID 4.2: The Board should approve an investment policy, setting out the objectives, risk tolerance, and the types of investments allowed." },
                    { dilemma: "The charity consistently runs enormous multi-year operational deficits but has no formal plan to restore its financial health beyond hoping for a sudden influx of public donations.", gec: "CODE ID 4.3: Ensure that financial plans are aligned with the charity's strategic plan and resources." },
                    { dilemma: "Your {charityType} signs a complex and extremely expensive 10-year IT software license, but no comprehensive risk assessment or budget analysis was presented to the Board.", gec: "CODE ID 4.5: Ensure a risk management process is in place to identify and mitigate key risks." },
                    { dilemma: "An aging IT system crashes for two days, and it is discovered the charity has zero data backup facilities or any documented business continuity plan.", gec: "CODE ID 4.6: Implement a resilient disaster recovery and business continuity plan." },
                    { dilemma: "Third-party fundraiser agents contracted by your charity are misleading donors on the streets with aggressive hard-sell tactics that clearly violate the sector's ethical guidelines.", gec: "CODE ID 4.7: Ensure that fundraising activities are transparent, ethical, and preserve the integrity of the charity." }
                ]
            },
            "5": {
                title: "Principle 5: The charity is accountable and transparent.",
                pool: [
                    { dilemma: "A server containing sensitive personal data of 2,000 donors to your {charityType} was inadvertently exposed online. The Executive Director suggests quietly patching it without notifying the Board or Authorities to avoid jeopardizing a major fundraising campaign.", gec: "CODE ID 5.4: The charity should put in place policies and procedures to ensure that it complies with the Personal Data Protection Act (PDPA)." },
                    { dilemma: "Your {charityType} quietly decides to not publish its annual report or financial statements online, claiming 'administrative burden', leading to public speculation about mismanagement of public donations.", gec: "CODE ID 5.1: The charity makes available to its stakeholders an annual report on its programmes, activities, and finances." },
                    { dilemma: "Whistleblowers within your {charityType} formally report severe workplace harassment to the board, but the HR committee buries the report entirely to protect a 'star' fundraising executive.", gec: "CODE ID 5.3: The charity should establish a whistle-blowing policy to provide a confidential channel for staff to report improprieties." },
                    { dilemma: "A major international donor explicitly demands detailed reporting on exactly how their restricted grant was spent, but the finance department lacks project-based accounting to trace the exact expenses.", gec: "CODE ID 5.2: Ensure that funds received are strictly used for the designated purposes and proper reports are provided." },
                    { dilemma: "There is no formal external audit of the charity's financial records despite its income significantly exceeding the legal threshold that mandates one.", gec: "CODE ID 5.5: Timely submission of exact financial reports to relevant regulatory bodies." },
                    { dilemma: "The board members regularly use their charity email to conduct personal business, bringing the charity into potentially awkward liability issues without a clear IT usage policy.", gec: "CODE ID 5.6: Maintain policies for accountability of all organizational resources including IT." },
                    { dilemma: "A large number of volunteers are operating high-risk machinery at a charity event without adequate safety briefings or liability waivers because 'they are just helping out'.", gec: "CODE ID 5.7: Ensure proper management, training, and accountability regarding all volunteers." },
                    { dilemma: "Top executives are receiving excessively lavish salaries that total over 60% of the entire charitys operational budget, yet these figures are intentionally hidden from the public.", gec: "CODE ID 5.8: Disclose the exact remuneration of key management personnel to ensure full transparency." }
                ]
            },
            "6": {
                title: "Principle 6: The charity communicates actively to instil public confidence.",
                pool: [
                    { dilemma: "A viral social media post falsely accuses your {charityType} of wasting funds on 'lavish staff retreats', utilizing out-of-context photos. Angry donors are flooding your inbox threatening to pull funding, yet the internal comms team remains silent.", gec: "CODE ID 6.1: The charity actively communicates with its stakeholders to instil public confidence and maintains its public image." },
                    { dilemma: "A major celebrity ambassador for your {charityType} is embroiled in a massive criminal scandal, and the media is demanding to know directly if the charity condones their actions.", gec: "CODE ID 6.2: The Board should establish guidelines on how the charity engages with the media and the public to protect its reputation." },
                    { dilemma: "Your {charityType} launches an awareness campaign that is widely criticized as culturally insensitive and highly offensive to a minority group in Singapore, sparking trending outrage across local forums.", gec: "CODE ID 6.3: The charity should carefully review public communications to ensure they accurately represent its mission and maintain public trust." }
                ]
            }
        };\;

// Find the regex block for the currently existing scenarios object:
let regex = /const scenarios = \\{(.|\\s)*?                 \\]\\s*\\}\\s*\\};/m;
content = content.replace(regex, newScenarios);

// Update handleAssessmentResponse block so user can't exit early
let handlerRegex = /setTimeout\\(\\(\\) => \\{[\\s\\S]*?addMessage\\("Noted. Do you need another scenario\\?", 'ai'\\);[\\s\\S]*?const chatWindow = document.getElementById\\('chatWindow'\\);[\\s\\S]*?chatWindow.innerHTML \\+= \\[\\s\\S]*?<div class="action-buttons">[\\s\\S]*?<button class="action-btn" onclick="handleContinueResponse\\('Yes'\\)">Yes, Generate Next<\\/button>[\\s\\S]*?<button class="action-btn" style="background-color: #d32f2f;" onclick="handleContinueResponse\\('No'\\)">No, End Session<\\/button>[\\s\\S]*?<\\/div>\\;[\\s\\S]*?scrollToBottom\\(\\);[\\s\\S]*?\\}, 800\\);/gm;

let newHandler = \setTimeout(() => {
                removeTypingIndicator(typingId);
                
                if (usedScenarios.size >= totalScenariosCount) {
                    addMessage("You have completed assessing ALL THE GUIDELINES! Assessment concluded. You can safely end the session now.", 'ai');
                    endSession();
                } else {
                    addMessage(\\\Assessment recorded. (\ / \ completed). Proceed to the next required scenario?\\\, 'ai');
                    const chatWindow = document.getElementById('chatWindow');
                    chatWindow.innerHTML += \\\
                        <div class="action-buttons">
                        <button class="action-btn" style="background-color: #25D366; color: white; width: 100%; border: none;" onclick="handleContinueResponse('Yes')">Generate Next Scenario</button>
                    </div>\\\;
                    scrollToBottom();
                }
            }, 800);\;

content = content.replace(handlerRegex, newHandler);

fs.writeFileSync(file, content);
console.log('Update Complete.');
