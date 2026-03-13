from contextlib import asynccontextmanager

from fastapi import FastAPI

from db.database import create_db_and_tables
from routers.inventory_router import router as inventory_router
from routers.breed_router import router as breed_router
from routers.barn_router import router as barn_router
from routers.pasture_router import router as pasture_router
from routers.health_router import router as health_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def health():
    return {"status": "ok"}

app.include_router(inventory_router, prefix="/api")
app.include_router(breed_router, prefix="/api")
app.include_router(barn_router, prefix="/api")

app.include_router(pasture_router, prefix="/api")

app.include_router(health_router, prefix="/api")