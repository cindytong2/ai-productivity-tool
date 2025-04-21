from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

class NoteRequest(BaseModel):
    note: str

class TopicRequest(BaseModel):
    topic: str

@app.post("/summarize")
def summarize_note(req: NoteRequest):
    # Placeholder for OpenAI integration
    return {"summary": f"Summary of: {req.note}"}

@app.post("/generate-ideas")
def generate_ideas(req: TopicRequest):
    # Placeholder for OpenAI integration
    return {"ideas": [f"Idea for: {req.topic}"]}

@app.get("/")
def root():
    return {"message": "AI Productivity Tool Backend"}
