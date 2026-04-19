from fastapi import HTTPException
from sqlmodel import Session, select

from models.horse import Horse
from models.breed import Breed
from models.barn import Barn
from models.pasture import Pasture
from models.owner import OwnerInfo
from models.medical_records import MedicalRecords
from models.horse_allergy_records import HorseAllergyRecords
from models.custom_allergies import HorseCustomAllergy
from models.horse_health_conditions import HorseHealthConditions
from models.custom_health_conditions import HorseCustomHealthCondition
from models.medication import HorseMedication
from models.supplements import HorseSupplements
from models.feeding_regime import FeedingRegime

from schemas.horse_request import HorseRequest


def create_horse(
    session: Session,
    submission: HorseRequest,
    image_url: str
) -> Horse:

    breed = session.exec(
        select(Breed).where(Breed.name == submission.breed)
    ).first()

    if not breed:
        raise HTTPException(status_code=404, detail="Breed not found")

    owner = session.exec(
        select(OwnerInfo).where(OwnerInfo.owner_name == submission.ownerName)
    ).first()

    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    barn_id = None
    pasture_id = None
    stall_id = None

    if submission.locationType == "stall":
        if not submission.barn:
            raise HTTPException(status_code=400, detail="Barn is required for stalled horses")

        if not submission.stallId:
            raise HTTPException(status_code=400, detail="Stall ID is required for stalled horses")

        barn = session.exec(
            select(Barn).where(Barn.name == submission.barn)
        ).first()

        if not barn:
            raise HTTPException(status_code=404, detail="Barn not found")

        barn_id = barn.id
        stall_id = submission.stallId

        if submission.pastureName:
            pasture = session.exec(
                select(Pasture).where(Pasture.name == submission.pastureName)
            ).first()

            if not pasture:
                raise HTTPException(status_code=404, detail="Pasture not found")

            pasture_id = pasture.id

    elif submission.locationType == "pasture":
        if not submission.pastureName:
            raise HTTPException(status_code=400, detail="Pasture is required for horses living in pasture")

        pasture = session.exec(
            select(Pasture).where(Pasture.name == submission.pastureName)
        ).first()

        if not pasture:
            raise HTTPException(status_code=404, detail="Pasture not found")

        pasture_id = pasture.id

    else:
        raise HTTPException(status_code=400, detail="Invalid location type")

    horse = Horse(
        breed_id=breed.id,
        owner_id=owner.owner_id,
        barn_id=barn_id,
        pasture_id=pasture_id,
        horse_name=submission.horseName,
        sex=submission.sex,
        birthdate=submission.birthdate,
        height=submission.height,
        weight=submission.weight,

        location_type=submission.locationType,
        turnout_type=submission.turnoutType,
        stall_id=stall_id,

        escape_risk=submission.escapeRisk,
        may_bite=submission.mayBite,
        may_kick=submission.mayKick,
        difficult_to_catch=submission.difficultToCatch,
        herd_dominant=submission.herdDominant,
        sedation_required=submission.sedationRequired,
        food_aggressive=submission.foodAggressive,
        requires_experienced_handler=submission.requiresExperiencedHandler,

        temperament=submission.temperament,
        notes=submission.notes,
        image=image_url,
    )

    session.add(horse)
    session.commit()
    session.refresh(horse)

    return horse

def update_horse(
    session: Session,
    horse_id: str,
    submission: HorseRequest,
    image_url: str
) -> Horse:
    horse = session.exec(
        select(Horse).where(Horse.horse_id == horse_id)
    ).first()

    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    breed = session.exec(
        select(Breed).where(Breed.name == submission.breed)
    ).first()
    if not breed:
        raise HTTPException(status_code=404, detail="Breed not found")

    owner = session.exec(
        select(OwnerInfo).where(OwnerInfo.owner_name == submission.ownerName)
    ).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    barn_id = None
    pasture_id = None
    stall_id = None

    if submission.locationType == "stall":
        if not submission.barn:
            raise HTTPException(status_code=400, detail="Barn is required for stalled horses")

        if not submission.stallId:
            raise HTTPException(status_code=400, detail="Stall ID is required for stalled horses")

        barn = session.exec(
            select(Barn).where(Barn.name == submission.barn)
        ).first()
        if not barn:
            raise HTTPException(status_code=404, detail="Barn not found")

        barn_id = barn.id
        stall_id = submission.stallId

        if submission.pastureName:
            pasture = session.exec(
                select(Pasture).where(Pasture.name == submission.pastureName)
            ).first()
            if not pasture:
                raise HTTPException(status_code=404, detail="Pasture not found")
            pasture_id = pasture.id

    elif submission.locationType == "pasture":
        if not submission.pastureName:
            raise HTTPException(status_code=400, detail="Pasture is required for horses living in pasture")

        pasture = session.exec(
            select(Pasture).where(Pasture.name == submission.pastureName)
        ).first()
        if not pasture:
            raise HTTPException(status_code=404, detail="Pasture not found")

        pasture_id = pasture.id
        stall_id = None
        barn_id = None

    else:
        raise HTTPException(status_code=400, detail="Invalid location type")

    horse.breed_id = breed.id
    horse.owner_id = owner.owner_id
    horse.barn_id = barn_id
    horse.pasture_id = pasture_id
    horse.horse_name = submission.horseName
    horse.sex = submission.sex
    horse.birthdate = submission.birthdate
    horse.height = submission.height
    horse.weight = submission.weight
    horse.location_type = submission.locationType
    horse.turnout_type = submission.turnoutType
    horse.stall_id = stall_id

    horse.escape_risk = submission.escapeRisk
    horse.may_bite = submission.mayBite
    horse.may_kick = submission.mayKick
    horse.difficult_to_catch = submission.difficultToCatch
    horse.herd_dominant = submission.herdDominant
    horse.sedation_required = submission.sedationRequired
    horse.food_aggressive = submission.foodAggressive
    horse.requires_experienced_handler = submission.requiresExperiencedHandler

    horse.temperament = submission.temperament
    horse.notes = submission.notes

    if image_url:
        horse.image = image_url

    session.add(horse)
    session.commit()
    session.refresh(horse)

    return horse


def delete_horse(
    session: Session,
    horse_id: str,
) -> None:
    horse = session.exec(
        select(Horse).where(Horse.horse_id == horse_id)
    ).first()

    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    related_models = [
        MedicalRecords,
        HorseAllergyRecords,
        HorseCustomAllergy,
        HorseHealthConditions,
        HorseCustomHealthCondition,
        HorseMedication,
        HorseSupplements,
        FeedingRegime,
    ]

    for model in related_models:
        rows = session.exec(
            select(model).where(model.horse_id == horse_id)
        ).all()

        for row in rows:
            session.delete(row)

    session.delete(horse)
    session.commit()
