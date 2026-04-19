from typing import Optional

from fastapi import HTTPException
from sqlmodel import Session, select

from models.inventory_items import InventoryItems

from schemas.item_request import ItemRequest

def normalize_label(label: str) -> str:
    return " ".join(label.strip().lower().split())

def clean_label(label: str) -> str:
    return " ".join(label.strip().split())

def create_item(
        session: Session,
        submission: ItemRequest,
        image_url: str
) -> InventoryItems:

    cleaned_label = clean_label(submission.label)
    normalized_label = normalize_label(submission.label)

    if not normalized_label:
        raise HTTPException(
            status_code=400,
            detail="Item label cannot be empty"
        )

    existing_item = session.exec(
        select(InventoryItems).where(
            InventoryItems.normalized_label == normalized_label
        )
    ).first()

    if existing_item:
        raise HTTPException(
            status_code=400,
            detail="An inventory item with this label already exists."
        )

    db_submission = InventoryItems(
        label = cleaned_label,
        normalized_label = normalized_label,
        quantity = submission.quantity,
        category = submission.category.strip(),
        grade = submission.grade,
        instructions = submission.instructions,
        image_url = image_url
)

    session.add(db_submission)
    session.commit()
    session.refresh(db_submission)

    return db_submission


def update_item(
        session: Session,
        item_id: str,
        submission: ItemRequest,
        image_url: Optional[str] = None
) -> InventoryItems:
    item = session.get(InventoryItems, item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    cleaned_label = clean_label(submission.label)
    normalized_label = normalize_label(submission.label)

    if not normalized_label:
        raise HTTPException(
            status_code=400,
            detail="Item label cannot be empty"
        )

    existing_item = session.exec(
        select(InventoryItems).where(
            InventoryItems.normalized_label == normalized_label,
            InventoryItems.item_id != item_id
        )
    ).first()

    if existing_item:
        raise HTTPException(
            status_code=400,
            detail="An inventory item with this label already exists."
        )

    item.label = cleaned_label
    item.normalized_label = normalized_label
    item.quantity = submission.quantity
    item.category = submission.category.strip()
    item.grade = submission.grade
    item.instructions = submission.instructions

    if image_url:
        item.image_url = image_url

    session.add(item)
    session.commit()
    session.refresh(item)

    return item
