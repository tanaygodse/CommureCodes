from pydantic import BaseModel
from datetime import datetime

class Appointment(BaseModel):
    patientId: str
    doctorId: str
    date: datetime
    appointmentType: str
    notes: str = ""
    status: str = "Scheduled"
