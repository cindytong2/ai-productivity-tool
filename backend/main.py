from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoteRequest(BaseModel):
    note: str

class TopicRequest(BaseModel):
    topic: str

@app.post("/summarize-pdf")
async def summarize_pdf(request: Request):
    data = await request.json()
    pdf_text = data.get("text", "")
    print(f"Received text length: {len(pdf_text)}")
    if not pdf_text or len(pdf_text.strip()) < 10:
        return {"error": "No or too little text extracted from PDF."}
    # Limit input size for Hugging Face API (models like bart-large-cnn have input limits)
    max_len = 2048
    if len(pdf_text) > max_len:
        pdf_text = pdf_text[:max_len]
    api_url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"} if HUGGINGFACE_API_TOKEN else {}
    payload = {"inputs": pdf_text}
    try:
        hf_response = requests.post(api_url, headers=headers, json=payload, timeout=60)
        hf_response.raise_for_status()
        result = hf_response.json()
        print(f"Hugging Face API response: {result}")
        if isinstance(result, list) and "summary_text" in result[0]:
            summary = result[0]["summary_text"]
            return {"summary": summary}
        elif "error" in result:
            return {"error": result["error"]}
        else:
            return {"error": "Unexpected response from Hugging Face API."}
    except Exception as e:
        print(f"Backend error: {e}")
        return {"error": str(e)}

@app.post("/generate-ideas")
def generate_ideas(req: TopicRequest):
    # Placeholder for OpenAI integration
    return {"ideas": [f"Idea for: {req.topic}"]}

@app.get("/")
def root():
    return {"message": "AI Productivity Tool Backend"}
