from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from db.database import create_db_and_tables

from routers.inventory_router import router as inventory_router
from routers.breed_router import router as breed_router
from routers.barn_router import router as barn_router
from routers.pasture_router import router as pasture_router
from routers.health_router import router as health_router
from routers.allergy_router import router as allergy_router
from routers.horse_router import router as horse_router
from routers.owner_router import router as owner_router
from routers.medical_records_router import router as medical_records_router
from routers.feed_router import router as feed_router
from routers.document_router import router as document_router
from routers.medication_router import router as medication_router
from routers.supplement_router import router as supplement_router
from routers.rag_router import router as rag_router


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
app.include_router(allergy_router, prefix="/api")
app.include_router(horse_router, prefix="/api")
app.include_router(owner_router, prefix="/api")
app.include_router(medical_records_router, prefix="/api")
app.include_router(feed_router, prefix="/api")
app.include_router(document_router, prefix="/api")
app.include_router(medication_router, prefix="/api")
app.include_router(supplement_router, prefix="/api")
app.include_router(rag_router, prefix="/api")