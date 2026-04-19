from fastapi import HTTPException
from sqlmodel import Session, select

from models.horse import Horse
from models.supplements import HorseSupplements
from models.inventory_items import InventoryItems
from schemas.supplements_response import SupplementResponse
from schemas.medical_record_request import CareScheduleEntry
from services.medical_record_service import sync_horse_supplements


def get_supplements_by_horse(
    session: Session,
    horse_id: str,
) -> list[SupplementResponse]:
    horse = session.get(Horse, horse_id)
    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    supplements = session.exec(
        select(HorseSupplements).where(HorseSupplements.horse_id == horse_id)
    ).all()

    results = []

    for supplement in supplements:
        item = session.get(InventoryItems, supplement.item_id)

        results.append(
            SupplementResponse(
                horse_supplements_id=supplement.horse_supplements_id,
                horse_id=supplement.horse_id,
                item_id=supplement.item_id,
                supplement_name=item.label if item else "Unknown supplement",
                dosage_amount=supplement.dosage_amount,
                dosage_unit=supplement.dosage_unit,
                frequency_type=supplement.frequency_type,
                administration_times=supplement.administration_times or [],
                schedule_details=supplement.schedule_details or {},
                single_dose_date=supplement.single_dose_date,
                notes=supplement.notes,
                created_at=supplement.created_at,
                updated_at=supplement.updated_at,
            )
        )

    return results


def replace_supplements_by_horse(
    session: Session,
    horse_id: str,
    supplements: list[CareScheduleEntry],
) -> list[SupplementResponse]:
    horse = session.get(Horse, horse_id)
    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    sync_horse_supplements(session, horse_id, supplements)
    session.commit()

    return get_supplements_by_horse(session=session, horse_id=horse_id)
