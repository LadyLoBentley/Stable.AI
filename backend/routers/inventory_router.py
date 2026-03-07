from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlmodel import Session, select

from db.database import get_session
from schemas.item_request import ItemRequest
from schemas.item_response import ItemResponse
from services.item_service import CreateItem
from services.storage_service import upload_inventory_image
from models.inventory_items import InventoryItems

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.post("/", response_model=ItemResponse)
async def add_inventory(
        label: str = Form(...),
        quantity: int = Form(0),
        category: str = Form(...),
        grade: str = Form(...),
        instructions: str = Form(...),
        image: UploadFile = File(...),
        session: Session = Depends(get_session),
):
    submission = ItemRequest(
        label=label,
        quantity=quantity,
        category=category,
        grade=grade,
        instructions=instructions
    )

    image_url = await upload_inventory_image(image)

    create_item = CreateItem(
        session=session,
        submission=submission,
        image_url=image_url
    )

    return ItemResponse(
        item_id = create_item.item_id,
        label = create_item.label,
        quantity = create_item.quantity,
        category = create_item.category,
        grade = create_item.grade,
        instructions = create_item.instructions,
        image_url = create_item.image_url,
        stock_status = create_item.stock_status,
        created_at = create_item.created_at,
        updated_at = create_item.updated_at,
    )

@router.get("/", response_model=list[ItemResponse])
def get_inventory(session: Session = Depends(get_session)):
    inventory = session.exec(select(InventoryItems)).all()

    return [
        ItemResponse(
            item_id = item.item_id,
            label = item.label,
            quantity = item.quantity,
            category = item.category,
            grade = item.grade,
            instructions = item.instructions,
            image_url = item.image_url,
            stock_status = item.stock_status,
            created_at = item.created_at,
            updated_at = item.updated_at
        )
        for item in inventory
    ]