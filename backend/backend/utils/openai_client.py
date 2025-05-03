from fastapi import APIRouter, Request
from openai import OpenAI
import os
import dateparser
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
now = datetime.now()
formatted_time = now.strftime("%I:%M %p")  # e.g., 11:42 AM
today_str = now.strftime("%m-%d-%Y")
llm_router = APIRouter()

print(formatted_time)
print(today_str)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def parse_date(text):
    parsed = dateparser.parse(text, settings={"PREFER_DATES_FROM": "future"})
    if parsed:
        return parsed.strftime("%m-%d-%Y")
    return "null"

@llm_router.post("/parse-task")
async def parse_task(request: Request):
    
    body = await request.json()
    prompt = body.get("prompt")

    

    system_prompt = f"""
You are an AI medical assistant designed to convert a doctor's speech-to-text instruction into structured JSON data. Carefully extract information based on the rules and field descriptions below.

📅 Context:
- "today": {today_str} (MM-DD-YYYY)
- "currentTime": {formatted_time} (e.g., 02:30 PM)

📦 Output JSON Format:
{{
  "items": [
    {{
      "type": "Appointment",  // Denotes this entry is a doctor-supervised medical activity
      "appointments": {{
        "appointment1": {{
          "appointmentType": "blood_test | x_ray | vaccination | check_up | surgery",  // Medical action requiring clinic visit
          "order": integer  // Execution sequence among all actions (appointments + tasks)
        }},
        // additional appointment2, appointment3 if needed
      }},
      "StartDate": "MM-DD-YYYY" | "null",  // First day patient should perform the action
      "EndDate": "MM-DD-YYYY" | "null",    // Last day of the action
      "startTime": "10:00 AM" | "null",    // Optional: time patient starts appointment
      "endTime": "11:00 AM" | "null",      // Optional: time appointment ends
      "points": "10" | "50" | "100"        // Seriousness of the action:
                                           // 10 = low (e.g., drink water)
                                           // 50 = normal (e.g., vaccination)
                                           // 100 = critical (e.g., MRI, surgery)
    }}
  ]
}}

Time Phrase Mappings:
- "after lunch" → "03:00 PM"
- "before lunch" → "12:00 PM"
- "morning" → "09:00 AM"
- "afternoon" → "02:00 PM"
- "evening" → "06:00 PM"
- "night" → "09:00 PM"
- "after dinner" → "08:00 PM"
- "before breakfast" → "07:00 AM"
- "bedtime" → "10:00 PM"

If no time is mentioned, return "null" for startTime and endTime.

🧠 Field Purposes:
- **type**: Indicates whether the entry is a `"Task"` or `"Appointment"`
- **appointments**: Contains one or more specific appointment instructions
- **appointmentType**: The medical procedure or activity involved
- **order**: The sequence in which the item should be completed
- **StartDate / EndDate**: Start and end of the time window for the task or appointment
- **startTime / endTime**: Exact hours (if mentioned) for performing the task/appointment
- **points**: Used for prioritization; higher = more critical

🧠 Interpretation Rules:
- If instruction says "for 3 days" and no start date is given → assume start date is **tomorrow**
- If instruction says "after 3 days":
  - If currentTime < 12:00 PM, count from **today**
  - Else, count from **tomorrow**

🛑 Response Rules:
- Return only a valid **JSON object**
- Quote all keys and string values
- If a field is unknown, use the string "null"
- Do not include any explanation or extra formatting outside the JSON
"""


    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    print(response)
    import json
    try:
        # Evaluate JSON safely
        content = response.choices[0].message.content.strip()
        data = json.loads(content)

        for item in data.get("items", []):
            # Normalize appointment dates
            if item.get("appointmentStartDate"):
                item["appointmentStartDate"] = parse_date(item["appointmentStartDate"])
            if item.get("appointmentEndDate"):
                item["appointmentEndDate"] = parse_date(item["appointmentEndDate"])

            # Normalize task dates
            if item.get("taskStartDate"):
                item["taskStartDate"] = parse_date(item["taskStartDate"])
            if item.get("taskEndDate"):
                item["taskEndDate"] = parse_date(item["taskEndDate"])
        print(data)
        return data

    except Exception as e:
        print("❌ Parse error:", e)
        return {"error": "Invalid response or JSON parse error"}
