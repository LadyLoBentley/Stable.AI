# HorseDashboard.AI
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
│   ├── models/
│   │   ├── horse.py
│   │   ├── medical_records.py
│   │   └── inventory_items.py
│   ├── rag/
│   │   ├── chunking.py
│   │   ├── embedder.py
│   │   ├── prompt_builder.py
│   │   └── vector_store.py
│   ├── routers/
│   │   ├── feed_service.py
│   │   ├── horse_router.py
│   │   ├── inventory_router.py
│   │   └── rag_router.py
│   ├── schemas/
│   │   ├── horse_request.py
│   │   └── item_response.py
│   ├── services/
│   │   ├── medical_record_service.py
│   │   ├── feed_service.py
│   │   └── rag_service.py
│   ├── main.py
│   └── requirements.txt
│   
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   └── Chatbot
│   │   ├── Pages/
│   │   │   ├── HorseForm/
│   │   │   ├── AddInventoryForm.jsx
│   │   │   ├── Documents.jsx
│   │   │   └── Inventory.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └──  main.jsx
│   ├── elint.config.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
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