# Stable.AI
A software application for equine care and efficient barn operations. Provides a user friendly UI of the database 
containing barn horses with a RAG system that assists with daily operations, management concerns, and animal care. It 
provides non-diagnostic guidance and expert knowledge to inexperienced horse owners, staff, and volutneers.

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- CSS (custom styling)

### Backend
- FastAPI
- Python 3.10+

---

## Project Structure

```text
Stable.AI/
├── backend/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── .env.example
│   ├── dependencies.py
│   ├── main.py
│   └── requirements.txt
│   
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── Assets/
│   │   │   ├── react.svg
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── index.css
│   │   ├── main.jsx
│   ├── .gitignore
│   ├── elint.config.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── resources/
├── .gitignore
├── LICENSE
└── README.md
```
---nano ~/.zshrc



## Running the Project

Backend and frontend run separately.

---

## Backend Setup (FastAPI)

Ensure we are in the backend directory. Create a virtual environment, then activate it. Ensure all requirements is 
met and FastAPI is installed.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Run Server

We are ready to start the backend application!

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8002

```

### Test API

Open browser:

```
http://127.0.0.1:8002/
```

Expected response:

```json
{"message": "Hello World"}
```

---

## Frontend Setup (React + Vite)

Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open browser:

```
http://localhost:5173
```

---

### Database Setup (Supabase)

Inside the `backend/` directory, create a `.env` file. This file contains secrets and **must not** be committed (it 
should be listed in `.gitignore`).

You may copy `backend/.env.example` and replace the placeholder values with your Supabase credentials:

```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Ensure that the Supabase client is installed:

```bash
cd backend
source .venv/bin/activate
pip install supabase python-dotenv
```

### Testing Database Connection 

Run the backend server:

```bash 
uvicorn main:app --reload --port 8002
```

Open browser:

```
http://127.0.0.1:8002/supabase/ping
```

You should receive a message (200) showing that the database is successfully connected.