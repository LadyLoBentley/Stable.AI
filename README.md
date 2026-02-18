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
│   │   ├── pages/
│   │   │   ├── dashboard.jsx
│   │   │   └── sensors.jsx
│   │   ├── App.jsx
│   │   ├── layout.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── resources/
├── .gitignore
└── README.md
```

---

## Running the Project

Backend and frontend run separately.

---

## Backend Setup (FastAPI)

### Ensure that anaconda is NOT the framework. 

Anytime I ran into any issues, it was because of anaconda. Ensure that you
have the correct environment.

```bash
conda config --set auto_activate_base false
echo $CONDA_DEFAULT_ENV
which python
```

Python should NOT point to /opt/miniconda/3... Restart the terminal. :)

### Set Up The Environment

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

Install the Supabase CLI

```bash
npm install supabase --save-dev
```
