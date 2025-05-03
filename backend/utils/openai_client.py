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

    system_prompt = """You are a medical assistant. Extract a structured JSON object from the following doctor's instruction.


Very important note : Use below date and time to calculate any date and time keep in mind:
- today = {today_str}
- current time = {formatted_time}


The output must include the following structure:
- "items": An array of Appointment or Task objects.
  - Each object can include:
    - "type": "Appointment", "Task", or "null"

    - If type is "Appointment":
      - "appointments": a dictionary with keys like "appointment1", "appointment2", etc.
        - Each appointment must include:
          - "appointmentType": e.g., "blood_test", "x_ray", "vaccination"
          - "order": an integer indicating when it should be done relative to other items
      - "appointmentStartDate": in MM-DD-YYYY format, or "null"
      - "appointmentEndDate": in MM-DD-YYYY format, or "null"
      - "startTime": (optional) in format like "10:00 AM", or "null"
      - "endTime": (optional) in format like "11:00 AM", or "null"

    - If type is "Task":
      - "tasks": a dictionary with keys like "task1", "task2", etc.
        - Each task must include:
          - "task": the patient's action (e.g., "take paracetamol", "exercise", "drink water")
          - "order": an integer indicating when it should be done relative to other items
      - "taskStartDate": in MM-DD-YYYY format, or "null"
      - "taskEndDate": in MM-DD-YYYY format, or "null"
      - "startTime": (optional) in format like "10:00 AM", or "null"
      - "endTime": (optional) in format like "11:00 AM", or "null"
      - "frequency": if available, such as "2 per day", "once daily", or "30 days"

🧠 Interpretation Rules:
- If a phrase like “for 3 days” is used without a start date, assume the start date is **tomorrow** and calculate the end date accordingly.
  Example: If today is 04-30-2025 and the instruction says “take medicine for 3 days”:
    - "taskStartDate": "05-01-2025"
    - "taskEndDate": "05-03-2025"

- If the instruction includes "after X days" (e.g., "blood test after 3 days"):
  - If current time is **before 12:00 PM**, count from **today**.
  - If current time is **after 12:00 PM**, count from **tomorrow**.



🛑 Rules:
- Return a valid **JSON object only** — no extra text or explanation
- Quote all keys and string values
- If a field is not available, return "null"

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

        return data

    except Exception as e:
        print("❌ Parse error:", e)
        return {"error": "Invalid response or JSON parse error"}
