from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from .routes.classification import router as classification_router

app = FastAPI(
    title="Pulse AI Service",
    description="AI-powered SDG Classification and Impact Scoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "message": "Pulse AI Service is running",
        "version": "1.0.0"
    }

app.include_router(classification_router, prefix="/api", tags=["Classification"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Pulse AI Service",
        "docs": "/docs"
    }
