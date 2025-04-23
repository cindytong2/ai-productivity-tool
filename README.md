# AI Productivity Tool

## Prerequisites

- Node.js (v14 or above recommended)
- Python 3.7+
- (Recommended) Create a virtual environment for Python

## Backend Setup (FastAPI)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set environment variables:**
   - Create a `.env` file in the `backend` directory with your OpenAI API key:
     ```env
     OPENAI_API_KEY=your_openai_api_key_here
     ```
4. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000` by default.

## Frontend Setup (React)

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000` by default.

## Usage

- Ensure the backend is running before using the frontend app.
- The frontend will make API requests to the backend endpoints.

## Project Structure

- `backend/` – FastAPI backend server
- `client/` – React frontend app

---