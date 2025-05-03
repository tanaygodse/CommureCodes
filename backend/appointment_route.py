from fastapi import APIRouter
from .appointment import Appointment
from .utils.db import get_collection
from bson import ObjectId
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

router = APIRouter()

class TaskItem(BaseModel):
    type: str
    tasks: Optional[Dict[str, Any]]
    taskStartDate: Optional[str]
    taskEndDate: Optional[str]
    startTime: Optional[str]
    endTime: Optional[str]
    frequency: Optional[str] = None

class AppointmentItem(BaseModel):
    type: str
    appointments: Optional[Dict[str, Any]]
    appointmentStartDate: Optional[str]
    appointmentEndDate: Optional[str]
    startTime: Optional[str]
    endTime: Optional[str]

class StructuredAppointment(BaseModel):
    doctorId: str
    patientId: str
    items: List[dict]
    notes: Optional[str] = None
    

@router.post("/appointments")
def create_appointment(data: Appointment):
    print("📥 Received appointment data:", data)
    collection = get_collection("appointments")
    doc = {
        "patientId": ObjectId(data.patientId),
        "doctorId": ObjectId(data.doctorId),
        "date": data.date,
        "appointmentType": data.appointmentType,
        "notes": data.notes,
        "status": data.status,
        "createdAt": datetime.utcnow()
    }
    result = collection.insert_one(doc)
    print("✅ Document inserted with ID:", result.inserted_id)
    return {"insertedId": str(result.inserted_id)}



@router.post("/appointments/structured")
async def save_structured_appointments(request: StructuredAppointment):
    print("📦 Payload received:", request)
    
    doctor_id = request.doctorId
    patient_id = request.patientId
    items = request.items
    notes = request.notes

    if not doctor_id or not patient_id:
        return {"error": "Missing doctorId or patientId"}

    collection = get_collection("appointments")
    inserted_ids = []

    for item in items:
        type_block = {}

        if item.get("appointments"):
            type_block["Appointment"] = {
                "appointments": item.get("appointments", {}),
                "appointmentStartDate": item.get("appointmentStartDate", "null"),
                "appointmentEndDate": item.get("appointmentEndDate", "null"),
                "startTime": item.get("startTime", "null"),
                "endTime": item.get("endTime", "null"),
            }

        if item.get("tasks"):
            type_block["Task"] = {
                "tasks": item.get("tasks", {}),
                "taskStartDate": item.get("taskStartDate", "null"),
                "taskEndDate": item.get("taskEndDate", "null"),
                "startTime": item.get("startTime", "null"),
                "endTime": item.get("endTime", "null"),
                "frequency": item.get("frequency", "null"),
            }

        appointment_doc = {
            "doctorId": doctor_id,
            "patientId": patient_id,
            "type": type_block,
            "status": "Pending",
            "createdAt": datetime.utcnow()
        }

        result = collection.insert_one(appointment_doc)
        inserted_ids.append(str(result.inserted_id))

    return {"insertedIds": inserted_ids}

@router.get("/appointments")
def list_appointments():
    collection = get_collection("appointments")
    appointments = list(collection.find().limit(50))

    # Convert ObjectId and any non-serializable fields
    for a in appointments:
        a["_id"] = str(a["_id"])
        if isinstance(a.get("patientId"), ObjectId):
            a["patientId"] = str(a["patientId"])
        if isinstance(a.get("doctorId"), ObjectId):
            a["doctorId"] = str(a["doctorId"])

    return appointments

@router.get("/patients")
def list_patients():
    collection = get_collection("Patients")
    patients = list(collection.find())
    
    for p in patients:
        p["_id"] = str(p["_id"])
        print(p)
    return patients

@router.post("/login")
def login(data: dict):
    collection = get_collection("Doctors")
    print(data)
    # You should validate inputs here
    doctor = collection.find_one({
        "email": data["email"],
        "password": data["password"]  # ⚠️ Plaintext only for testing, hash in prod
    })

    if not doctor:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "doctorId": str(doctor["_id"]),
        "name": doctor["name"],
        "email": doctor["email"]
    }


@router.post("/tasks")
def create_task(task: dict):
    collection = get_collection("tasks")
    task['createdAt'] = datetime.utcnow()
    result = collection.insert_one(task)
    return {"insertedId": str(result.inserted_id)}
