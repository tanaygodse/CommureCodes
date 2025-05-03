from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.appointment_route import router
from backend.utils.openai_client import llm_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS middleware must be added first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # your frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Then include your routers
app.include_router(router)
app.include_router(llm_router)