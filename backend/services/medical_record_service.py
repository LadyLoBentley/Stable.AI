from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy import func
from typing import List, Optional

from models.horse import Horse
from models.medical_records import MedicalRecords
from models.allergies import Allergies
from models.horse_allergy_records import HorseAllergyRecords
from models.custom_allergies import HorseCustomAllergy
from models.health_conditions import HealthConditions
from models.horse_health_conditions import HorseHealthConditions
from models.custom_health_conditions import HorseCustomHealthCondition
from models.medication import HorseMedication
from models.supplements import HorseSupplements
from models.inventory_items import InventoryItems

from schemas.medical_record_request import MedicalRecordRequest, CareScheduleEntry
from schemas.medical_record_response import MedicalRecordResponse

# Helper function for list of allergies and health conditions
def normalize_name_list(names: Optional[List[str]]) -> List[str]:
    if not names:
        return []

    cleaned = []
    seen = set()

    for raw in names:
        if not raw:
            continue

        name = raw.strip()
        if not name:
            continue

        key = name.lower()
        if key in seen:
            continue

        seen.add(key)
        cleaned.append(name)

    return cleaned

# Function used to add allergy records
    # If allergy exists in allergies table, it will add to HorseAllergyRecords
    # Otherwise, it is a custom allergy and will be stored in CustomAllergies
def sync_horse_allergies(session: Session, horse_id: str, submitted_allergy_names: Optional[List[str]]) -> None:
    cleaned_names = normalize_name_list(submitted_allergy_names)

    submitted_lookup = {name.lower(): name for name in cleaned_names}
    submitted_keys = set(submitted_lookup.keys())

    # Load existing standard allergy records for this horse
    standard_rows = session.exec(
        select(HorseAllergyRecords, Allergies)
        .join(Allergies, HorseAllergyRecords.allergy_id == Allergies.id)
        .where(HorseAllergyRecords.horse_id == horse_id)
    ).all()

    existing_standard_map = {
        allergy.name.lower(): record
        for record, allergy in standard_rows
    }

    # Load existing custom allergy records for this horse
    custom_rows = session.exec(
        select(HorseCustomAllergy).where(HorseCustomAllergy.horse_id == horse_id)
    ).all()

    existing_custom_map = {
        row.allergy_name.lower(): row
        for row in custom_rows
    }

    existing_keys = set(existing_standard_map.keys()) | set(existing_custom_map.keys())

    keys_to_remove = existing_keys - submitted_keys
    keys_to_add = submitted_keys - existing_keys

    # Remove deselected allergies
    for key in keys_to_remove:
        if key in existing_standard_map:
            session.delete(existing_standard_map[key])
        elif key in existing_custom_map:
            session.delete(existing_custom_map[key])

    # Add newly selected allergies
    for key in keys_to_add:
        original_name = submitted_lookup[key]

        standard_match = session.exec(
            select(Allergies).where(func.lower(Allergies.name) == key)
        ).first()

        if standard_match:
            session.add(
                HorseAllergyRecords(
                    horse_id=horse_id,
                    allergy_id=standard_match.id
                )
            )
        else:
            session.add(
                HorseCustomAllergy(
                    horse_id=horse_id,
                    allergy_name=original_name
                )
            )

# Does same thing as above function but for health conditions
def sync_horse_health_conditions(
    session: Session,
    horse_id: str,
    submitted_condition_names: Optional[List[str]]
) -> None:
    cleaned_names = normalize_name_list(submitted_condition_names)

    submitted_lookup = {name.lower(): name for name in cleaned_names}
    submitted_keys = set(submitted_lookup.keys())

    # Load existing standard health condition records for this horse
    standard_rows = session.exec(
        select(HorseHealthConditions, HealthConditions)
        .join(HealthConditions, HorseHealthConditions.health_condition_id == HealthConditions.id)
        .where(HorseHealthConditions.horse_id == horse_id)
    ).all()

    existing_standard_map = {
        condition.name.lower(): record
        for record, condition in standard_rows
    }

    # Load existing custom health condition records for this horse
    custom_rows = session.exec(
        select(HorseCustomHealthCondition).where(HorseCustomHealthCondition.horse_id == horse_id)
    ).all()

    existing_custom_map = {
        row.health_condition_name.lower(): row
        for row in custom_rows
    }

    existing_keys = set(existing_standard_map.keys()) | set(existing_custom_map.keys())

    keys_to_remove = existing_keys - submitted_keys
    keys_to_add = submitted_keys - existing_keys

    # Remove deselected conditions
    for key in keys_to_remove:
        if key in existing_standard_map:
            session.delete(existing_standard_map[key])
        elif key in existing_custom_map:
            session.delete(existing_custom_map[key])

    # Add newly selected conditions
    for key in keys_to_add:
        original_name = submitted_lookup[key]

        standard_match = session.exec(
            select(HealthConditions).where(func.lower(HealthConditions.name) == key)
        ).first()

        if standard_match:
            session.add(
                HorseHealthConditions(
                    horse_id=horse_id,
                    health_condition_id=standard_match.id
                )
            )
        else:
            session.add(
                HorseCustomHealthCondition(
                    horse_id=horse_id,
                    health_condition_name=original_name
                )
            )

def sync_horse_medications(
    session: Session,
    horse_id: str,
    submitted_medications: Optional[List[CareScheduleEntry]]
) -> None:
    submitted_medications = submitted_medications or []

    existing_rows = session.exec(
        select(HorseMedication).where(HorseMedication.horse_id == horse_id)
    ).all()

    for row in existing_rows:
        session.delete(row)

    for medication in submitted_medications:
        item_name = medication.itemName.strip()

        if not item_name:
            continue

        inventory_item = session.exec(
            select(InventoryItems).where(func.lower(InventoryItems.label) == item_name.lower())
        ).first()

        if not inventory_item:
            raise HTTPException(
                status_code=404,
                detail=f"Medication '{item_name}' not found in inventory"
            )

        if inventory_item.category != "Medication":
            raise HTTPException(
                status_code=400,
                detail=f"Inventory item '{item_name}' is not categorized as Medication"
            )

        session.add(
            HorseMedication(
                horse_id=horse_id,
                item_id=inventory_item.item_id,
                dosage_amount=medication.dosageAmount,
                dosage_unit = medication.dosageUnit,
                frequency_type=medication.frequencyType,
                administration_times=medication.administrationTimes,
                single_dose_date = medication.singleDoseDate,
                schedule_details=medication.scheduleDetails.model_dump(),
                notes=medication.notes
            )
        )

def sync_horse_supplements(
    session: Session,
    horse_id: str,
    submitted_supplements: Optional[List[CareScheduleEntry]]
) -> None:
    submitted_supplements = submitted_supplements or []

    existing_rows = session.exec(
        select(HorseSupplements).where(HorseSupplements.horse_id == horse_id)
    ).all()

    for row in existing_rows:
        session.delete(row)

    for supplement in submitted_supplements:
        item_name = supplement.itemName.strip()

        if not item_name:
            continue

        inventory_item = session.exec(
            select(InventoryItems).where(func.lower(InventoryItems.label) == item_name.lower())
        ).first()

        if not inventory_item:
            raise HTTPException(
                status_code=404,
                detail=f"Supplement '{item_name}' not found in inventory"
            )

        if inventory_item.category != "Supplements":
            raise HTTPException(
                status_code=400,
                detail=f"Inventory item '{item_name}' is not categorized as Supplements"
            )

        session.add(
            HorseSupplements(
                horse_id=horse_id,
                item_id=inventory_item.item_id,
                dosage_amount=supplement.dosageAmount,
                dosage_unit=supplement.dosageUnit,
                frequency_type=supplement.frequencyType,
                single_dose_date = supplement.singleDoseDate,
                administration_times=supplement.administrationTimes,
                schedule_details=supplement.scheduleDetails.model_dump(),
                notes=supplement.notes
            )
        )

def get_horse_allergy_names(session: Session, horse_id: str) -> List[str]:
    standard_allergies = session.exec(
        select(Allergies.name)
        .join(HorseAllergyRecords, HorseAllergyRecords.allergy_id == Allergies.id)
        .where(HorseAllergyRecords.horse_id == horse_id)
    ).all()

    custom_allergies = session.exec(
        select(HorseCustomAllergy.allergy_name)
        .where(HorseCustomAllergy.horse_id == horse_id)
    ).all()

    return normalize_name_list([*standard_allergies, *custom_allergies])


def get_horse_health_condition_names(session: Session, horse_id: str) -> List[str]:
    standard_conditions = session.exec(
        select(HealthConditions.name)
        .join(
            HorseHealthConditions,
            HorseHealthConditions.health_condition_id == HealthConditions.id
        )
        .where(HorseHealthConditions.horse_id == horse_id)
    ).all()

    custom_conditions = session.exec(
        select(HorseCustomHealthCondition.health_condition_name)
        .where(HorseCustomHealthCondition.horse_id == horse_id)
    ).all()

    return normalize_name_list([*standard_conditions, *custom_conditions])


def build_medical_record_response(
    session: Session,
    medical_record: MedicalRecords
) -> MedicalRecordResponse:
    allergies = get_horse_allergy_names(session, medical_record.horse_id)
    medical_conditions = get_horse_health_condition_names(session, medical_record.horse_id)

    return MedicalRecordResponse(
        horse_id=medical_record.horse_id,

        vet_clinic=medical_record.vet_clinic,
        vet_name=medical_record.vet_name,
        vet_phone=medical_record.vet_phone,

        is_same_vet=medical_record.is_same_vet,
        emergency_clinic=medical_record.emergency_clinic,
        emergency_vet_name=medical_record.emergency_vet_name,
        emergency_vet_phone=medical_record.emergency_vet_phone,
        emergency_authorization=medical_record.emergency_authorization,
        emergency_instructions=medical_record.emergency_instructions,

        rabies_expiration=medical_record.rabies_expiration,
        tetanus_expiration=medical_record.tetanus_expiration,
        west_nile_expiration=medical_record.west_nile_expiration,
        eee_wee_expiration=medical_record.eee_wee_expiration,
        flu_rhino_expiration=medical_record.flu_rhino_expiration,
        coggins_expiration=medical_record.coggins_expiration,

        has_shoes=medical_record.has_shoes,
        farrier_name=medical_record.farrier_name,
        farrier_phone=medical_record.farrier_phone,
        farrier_date=medical_record.farrier_date,
        dentist_name=medical_record.dentist_name,
        dentist_phone=medical_record.dentist_phone,
        dental_date=medical_record.dental_date,
        chiropractor_name=medical_record.chiropractor_name,
        chiropractor_phone=medical_record.chiropractor_phone,
        chiropractor_date=medical_record.chiropractor_date,
        massage_therapist=medical_record.massage_therapist,
        therapist_phone=medical_record.therapist_phone,
        massage_date=medical_record.massage_date,
        item_id=medical_record.item_id,
        deworm_provider=medical_record.deworm_provider,
        deworm_date=medical_record.deworm_date,

        medical_notes=medical_record.medical_notes,

        allergies=allergies,
        medical_conditions=medical_conditions,

        created_at=medical_record.created_at,
        updated_at=medical_record.updated_at
    )

def add_health_record(
        session: Session,
        submission: MedicalRecordRequest,
) -> MedicalRecords :

    dewormer_id = None
    if submission.lastDewormer:
        item = session.exec(
            select(InventoryItems).where(InventoryItems.label == submission.lastDewormer)
        ).first()

        if not item:
            raise HTTPException(status_code=404, detail=f"Dewormer not found")

        dewormer_id = item.item_id

    medical_record = session.exec(
        select(MedicalRecords).where(MedicalRecords.horse_id == submission.horse_id)
    ).first()

    if medical_record:
        medical_record.horse_id = submission.horse_id
        medical_record.item_id = dewormer_id

        medical_record.vet_clinic = submission.vetClinic
        medical_record.vet_name = submission.vetName
        medical_record.vet_phone = submission.vetPhone

        medical_record.is_same_vet = submission.isSameVet
        medical_record.emergency_clinic = submission.emergencyClinic
        medical_record.emergency_vet_name = submission.emergencyVetName
        medical_record.emergency_vet_phone = submission.emergencyVetPhone
        medical_record.emergency_authorization = submission.emergencyAuthorization
        medical_record.emergency_instructions = submission.emergencyInstructions

        medical_record.rabies_expiration = submission.rabiesExpiration
        medical_record.tetanus_expiration = submission.tetanusExpiration
        medical_record.west_nile_expiration = submission.westNileExpiration
        medical_record.eee_wee_expiration = submission.eeeWeeExpiration
        medical_record.flu_rhino_expiration = submission.fluRhinoExpiration
        medical_record.coggins_expiration = submission.cogginsExpiration

        medical_record.has_shoes = submission.hasShoes
        medical_record.farrier_name = submission.farrierName
        medical_record.farrier_phone = submission.farrierPhone
        medical_record.farrier_date = submission.farrierDate
        medical_record.dentist_name = submission.dentistName
        medical_record.dentist_phone = submission.dentistPhone
        medical_record.dental_date = submission.dentalDate
        medical_record.chiropractor_name = submission.chiropractorName
        medical_record.chiropractor_phone = submission.chiropractorPhone
        medical_record.chiropractor_date = submission.chiropractorDate
        medical_record.massage_therapist = submission.massageTherapist
        medical_record.therapist_phone = submission.therapistPhone
        medical_record.massage_date = submission.massageDate
        medical_record.deworm_provider = submission.dewormProvider
        medical_record.deworm_date = submission.dewormDate

        medical_record.medical_notes = submission.medicalNotes

    else:
        medical_record = MedicalRecords(
            horse_id=submission.horse_id,
            item_id=dewormer_id,

            vet_clinic=submission.vetClinic,
            vet_name=submission.vetName,
            vet_phone=submission.vetPhone,

            is_same_vet=submission.isSameVet,
            emergency_clinic=submission.emergencyClinic,
            emergency_vet_name=submission.emergencyVetName,
            emergency_vet_phone=submission.emergencyVetPhone,
            emergency_authorization=submission.emergencyAuthorization,
            emergency_instructions=submission.emergencyInstructions,

            rabies_expiration=submission.rabiesExpiration,
            tetanus_expiration=submission.tetanusExpiration,
            west_nile_expiration=submission.westNileExpiration,
            eee_wee_expiration=submission.eeeWeeExpiration,
            flu_rhino_expiration=submission.fluRhinoExpiration,
            coggins_expiration=submission.cogginsExpiration,

            has_shoes=submission.hasShoes,
            farrier_name=submission.farrierName,
            farrier_phone=submission.farrierPhone,
            farrier_date=submission.farrierDate,
            dentist_name=submission.dentistName,
            dentist_phone=submission.dentistPhone,
            dental_date=submission.dentalDate,
            chiropractor_name=submission.chiropractorName,
            chiropractor_phone=submission.chiropractorPhone,
            chiropractor_date=submission.chiropractorDate,
            massage_therapist=submission.massageTherapist,
            therapist_phone=submission.therapistPhone,
            massage_date=submission.massageDate,
            deworm_provider=submission.dewormProvider,
            deworm_date=submission.dewormDate,

            medical_notes=submission.medicalNotes
        )

    session.add(medical_record)
    sync_horse_allergies(session, submission.horse_id, submission.allergies)
    sync_horse_health_conditions(session, submission.horse_id, submission.medicalConditions)
    sync_horse_medications(session, submission.horse_id, submission.medications)
    sync_horse_supplements(session, submission.horse_id, submission.supplements)

    session.commit()
    session.refresh(medical_record)

    return medical_record