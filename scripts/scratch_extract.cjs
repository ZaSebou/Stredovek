const fs = require('fs');
const path = require('path');
const readline = require('readline');

const conversations = [
    { id: "7cc5c60d-2a2b-4415-b520-9b0d2f7f1199", title: "Textová Strategie Architektura Projektu" },
    { id: "d99f9243-3195-42ff-8b2f-7554346669ea", title: "Implementace Herní Logiky Středověk" }
];

const baseDir = "C:\\Users\\honza\\.gemini\\antigravity\\brain";
const outputFile = "c:\\Git_Projekty\\Stredovek\\extracted_conversations.md";

async function processConversations() {
    const stream = fs.createWriteStream(outputFile, { encoding: 'utf8' });
    
    for (const conv of conversations) {
        stream.write(`# ${conv.title} (${conv.id})\n\n`);
        const transcriptPath = path.join(baseDir, conv.id, ".system_generated", "logs", "transcript.jsonl");
        
        if (!fs.existsSync(transcriptPath)) {
            stream.write(`Transcript not found: ${transcriptPath}\n\n`);
            continue;
        }
        
        const fileStream = fs.createReadStream(transcriptPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        
        for await (const line of rl) {
            try {
                const step = JSON.parse(line);
                const stepType = step.type;
                const content = step.content;
                
                if (stepType === "USER_INPUT" || stepType === "PLANNER_RESPONSE") {
                    stream.write(`## ${stepType}\n`);
                    if (typeof content === 'string') {
                        stream.write(content + "\n\n");
                    } else if (Array.isArray(content)) {
                        for (const part of content) {
                            if (part && typeof part === 'object' && part.text) {
                                stream.write(part.text + "\n");
                            } else if (typeof part === 'string') {
                                stream.write(part + "\n");
                            }
                        }
                        stream.write("\n");
                    }
                    stream.write("---\n\n");
                }
            } catch (e) {
                // Ignore parse errors or write them
            }
        }
    }
    stream.end();
    console.log("Extraction complete.");
}

processConversations();
