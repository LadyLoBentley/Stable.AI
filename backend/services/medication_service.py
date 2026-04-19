from fastapi import HTTPException
from sqlmodel import Session, select

from models.horse import Horse
from models.medication import HorseMedication
from models.inventory_items import InventoryItems
from schemas.medication_response import MedicationResponse
from schemas.medical_record_request import CareScheduleEntry
from services.medical_record_service import sync_horse_medications


def get_medications_by_horse(
    session: Session,
    horse_id: str,
) -> list[MedicationResponse]:
    horse = session.get(Horse, horse_id)
    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    medications = session.exec(
        select(HorseMedication).where(HorseMedication.horse_id == horse_id)
    ).all()

    results = []

    for medication in medications:
        item = session.get(InventoryItems, medication.item_id)

        results.append(
            MedicationResponse(
                horse_medication_id=medication.horse_medication_id,
                horse_id=medication.horse_id,
                item_id=medication.item_id,
                medication_name=item.label if item else "Unknown medication",
                dosage_amount=medication.dosage_amount,
                dosage_unit=medication.dosage_unit,
                frequency_type=medication.frequency_type,
                administration_times=medication.administration_times or [],
                schedule_details=medication.schedule_details or {},
                single_dose_date=medication.single_dose_date,
                notes=medication.notes,
                created_at=medication.created_at,
                updated_at=medication.updated_at,
            )
        )

    return results


def replace_medications_by_horse(
    session: Session,
    horse_id: str,
    medications: list[CareScheduleEntry],
) -> list[MedicationResponse]:
    horse = session.get(Horse, horse_id)
    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    sync_horse_medications(session, horse_id, medications)
    session.commit()

    return get_medications_by_horse(session=session, horse_id=horse_id)
