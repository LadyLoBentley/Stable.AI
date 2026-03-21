from fastapi import HTTPException
from sqlmodel import Session, select

from models.horse import Horse
from models.breed import Breed
from models.barn import Barn
from models.pasture import Pasture
from models.owner import OwnerInfo

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