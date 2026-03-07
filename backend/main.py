from contextlib import asynccontextmanager

from fastapi import FastAPI
from db.database import create_db_and_tables
from routers.inventory_router import router as inventory_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def health():
    return {"status": "ok"}

app.include_router(inventory_router, prefix="/api")