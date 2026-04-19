from typing import Optional

from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy import or_

from models.inventory_items import InventoryItems
from models.medication import HorseMedication
from models.supplements import HorseSupplements
from models.medical_records import MedicalRecords
from models.feeding_regime import FeedingRegime

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


def delete_item(
        session: Session,
        item_id: str,
) -> None:
    item = session.get(InventoryItems, item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    medication_count = len(session.exec(
        select(HorseMedication).where(HorseMedication.item_id == item_id)
    ).all())
    supplement_count = len(session.exec(
        select(HorseSupplements).where(HorseSupplements.item_id == item_id)
    ).all())
    medical_record_count = len(session.exec(
        select(MedicalRecords).where(MedicalRecords.item_id == item_id)
    ).all())
    feed_plan_count = len(session.exec(
        select(FeedingRegime).where(
            or_(
                FeedingRegime.hay_id == item_id,
                FeedingRegime.hay_replacement_id == item_id,
                FeedingRegime.grain_id == item_id,
                FeedingRegime.food_additive_id == item_id,
            )
        )
    ).all())

    usage_messages = []

    if medication_count:
        usage_messages.append(
            f"used in {medication_count} medication schedule{'s' if medication_count != 1 else ''}"
        )

    if supplement_count:
        usage_messages.append(
            f"used in {supplement_count} supplement schedule{'s' if supplement_count != 1 else ''}"
        )

    if medical_record_count:
        usage_messages.append(
            f"referenced in {medical_record_count} medical record{'s' if medical_record_count != 1 else ''}"
        )

    if feed_plan_count:
        usage_messages.append(
            f"referenced in {feed_plan_count} feed plan{'s' if feed_plan_count != 1 else ''}"
        )

    if usage_messages:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete this inventory item because it is {', '.join(usage_messages)}."
        )

    session.delete(item)
    session.commit()
