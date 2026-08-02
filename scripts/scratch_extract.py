import json
import os

conversations = [
    ("7cc5c60d-2a2b-4415-b520-9b0d2f7f1199", "Textová Strategie Architektura Projektu"),
    ("d99f9243-3195-42ff-8b2f-7554346669ea", "Implementace Herní Logiky Středověk")
]

base_dir = r"C:\Users\honza\.gemini\antigravity\brain"
output_file = "c:/Git_Projekty/Stredovek/extracted_conversations.md"

with open(output_file, "w", encoding="utf-8") as f_out:
    for conv_id, title in conversations:
        f_out.write(f"# {title} ({conv_id})\n\n")
        transcript_path = os.path.join(base_dir, conv_id, ".system_generated", "logs", "transcript.jsonl")
        
        if not os.path.exists(transcript_path):
            f_out.write(f"Transcript not found: {transcript_path}\n\n")
            continue
            
        with open(transcript_path, "r", encoding="utf-8") as f_in:
            for line in f_in:
                try:
                    step = json.loads(line)
                    step_type = step.get("type", "")
                    content = step.get("content", "")
                    
                    if step_type in ["USER_INPUT", "PLANNER_RESPONSE"]:
                        f_out.write(f"## {step_type}\n")
                        # Just grab the main text content or thinking, avoid huge tool output.
                        # Sometimes content is structured, sometimes simple string.
                        if isinstance(content, str):
                            f_out.write(content + "\n\n")
                        elif isinstance(content, list):
                            for part in content:
                                if isinstance(part, dict) and "text" in part:
                                    f_out.write(part["text"] + "\n")
                                elif isinstance(part, str):
                                    f_out.write(part + "\n")
                        f_out.write("\n---\n\n")
                except Exception as e:
                    f_out.write(f"Error parsing line: {e}\n\n")
