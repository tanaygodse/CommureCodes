from pymongo import MongoClient
from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).parent / ".env"
print("📄 Loading .env from:", env_path)
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
print("🔍 Loaded MONGO_URI:", MONGO_URI)


try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command("ping") 
    db = client["medschedule"]
    print("✅ MongoDB connection successful.")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

def get_collection(name: str):
    print(f"📦 Accessing collection: {name}")
    return db[name]
