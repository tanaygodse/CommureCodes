from openai import OpenAI
import datetime
import random
import json

client = OpenAI()

THEME = "Sci-fi"  # Change weekly or dynamically

TASKS = [
    "Exercise for 3 minutes",
    "Take a deep breath",
    "Drink a glass of water",
    "Stretch your back",
    "Stand up and walk for 2 minutes",
]


def get_today_task():
    # Optional: deterministic based on date (same task for same day)
    today = datetime.date.today().toordinal()
    return TASKS[today % len(TASKS)]


def generate_storyline(theme, task):
    user_prompt = f"""
    For any given theme and task, write a single-sentence storyline that briefly sets up a fictional world or situation rooted in the theme, and ends by clearly stating the real-world task without extra embellishment. 
    The sentence should be imaginative but concise, and the task must be explicitly stated at the end.

    Format:
    Storyline: [One-sentence story ending with: do [task]]

    Theme: {theme}
    Task: {task}
    """
    response = client.responses.create(
        model="gpt-4",
        input=[
            {"role": "system", "content": "You are a creative storyteller."},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.9,
    )
    return response.output_text


def generate_daily_storyline():
    # Build a numbered list of tasks
    tasks_block = "\n".join(f"{i + 1}. {t}" for i, t in enumerate(TASKS))

    # Single prompt asking for a JSON map
    user_prompt = f"""
    You are a creative storyteller writing for a child under 12 years old. For each of the following tasks under the theme "{THEME}", write a single-sentence storyline that ends by stating the real-world task exactly as given (no "Storyline:" prefix). 
    Return only a JSON object where each key is the task string and each value is the corresponding sentence.

    Tasks:
    {tasks_block}
    """

    response = client.responses.create(
        model="gpt-4",
        input=[
            {"role": "system", "content": "You are a creative storyteller."},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.9,
    )

    # Parse and return the JSON dict
    return json.loads(response.output_text)


if __name__ == "__main__":
    story_dict = generate_daily_storyline()
    print(story_dict)
