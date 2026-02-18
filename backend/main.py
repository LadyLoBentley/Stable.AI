import os
import httpx
from fastapi import FastAPI
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

def supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env")
    return create_client(url, key)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/supabase/ping")
async def supabase_ping():
    # Validates env is present (and keeps your logic in one place)
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return {"ok": False, "error": "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"}

    headers = {"apikey": key, "Authorization": f"Bearer {key}"}

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"{url}/rest/v1/", headers=headers)

        return {
            "ok": r.status_code in (200, 404),
            "status_code": r.status_code,
            "hint": "200/404 usually means reachable. 401 means bad key.",
            "response_preview": r.text[:200],
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}