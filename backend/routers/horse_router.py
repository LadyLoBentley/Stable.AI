from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlmodel import Session, select

from db.database import get_session

from schemas.horse_request import HorseRequest
from schemas.horse_response import HorseResponse

from services.horse_storage_service import upload_horse_image
from services.horse_service import create_horse

from models.horse import Horse
from models.breed import Breed
from models.barn import Barn
from models.pasture import Pasture
from models.owner import OwnerInfo

router = APIRouter(prefix="/horses", tags=["horses"])

@router.post("/", response_model=HorseResponse)
async def add_horse(
    horseName: str = Form(...),
    ownerName: str = Form(...),
    breed: str = Form(...),
    sex: str = Form(...),
    birthdate: date = Form(...),
    height: float = Form(...),
    weight: Optional[float] = Form(...),

    locationType: str = Form(...),
    turnoutType: str = Form(...),
    barn: Optional[str] = Form(None),
    stallId: Optional[str] = Form(None),
    pastureName: Optional[str] = Form(None),

    escapeRisk: bool = Form(False),
    mayBite: bool = Form(False),
    mayKick: bool = Form(False),
    difficultyToCatch:bool = Form(False),
    herdDominant: bool = Form(False),
    sedationRequired: bool = Form(False),
    foodAggressive: bool = Form(False),
    requiresExperiencedHandler: bool = Form(False),

    temperament: str = Form(...),
    notes: Optional[str] = Form(None),
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    submission = HorseRequest(
        horseName=horseName,
        ownerName=ownerName,
        breed=breed,
        sex=sex,
        birthdate=birthdate,
        height=height,
        weight=weight,

        locationType=locationType,
        turnoutType=turnoutType,
        barn=barn,
        pastureName=pastureName,
        stallId=stallId,

        escapeRisk=escapeRisk,
        mayBite=mayBite,
        mayKick=mayKick,
        difficultyToCatch=difficultyToCatch,
        herdDominant=herdDominant,
        sedationRequired=sedationRequired,
        foodAggressive=foodAggressive,
        requiresExperiencedHandler=requiresExperiencedHandler,

        temperament=temperament,
        notes=notes
    )

    image_url = await upload_horse_image(image)
    horse = create_horse(session=session, submission=submission, image_url=image_url)

    breed_obj = session.get(Breed, horse.breed_id)
    owner_obj = session.get(OwnerInfo, horse.owner_id)
    barn_obj = session.get(Barn, horse.barn_id) if horse.barn_id else None
    pasture_obj = session.get(Pasture, horse.pasture_id) if horse.pasture_id else None

    return HorseResponse(
        horse_id=horse.horse_id,
        horse_name=horse.horse_name,
        owner_name=owner_obj.owner_name if owner_obj else "",
        breed=breed_obj.name if breed_obj else "",
        sex=horse.sex,
        birthdate=horse.birthdate,
        height=horse.height,
        weight=horse.weight,

        location_type=horse.location_type,
        turnout_type=horse.turnout_type,
        barn=barn_obj.name if barn_obj else None,
        stall_id=horse.stall_id,
        pasture_name=pasture_obj.name if pasture_obj else None,

        escape_risk=horse.escape_risk,
        may_bite=horse.may_bite,
        may_kick=horse.may_kick,
        difficult_to_catch=horse.difficult_to_catch,
        herd_dominant=horse.herd_dominant,
        sedation_required=horse.sedation_required,
        food_aggressive=horse.food_aggressive,
        requires_experienced_handler=horse.requires_experienced_handler,

        temperament=horse.temperament,
        notes=horse.notes,
        image=horse.image,

        created_at=horse.created_at,
        updated_at=horse.updated_at,
    )


@router.get("/", response_model=list[HorseResponse])
def get_horses(session: Session = Depends(get_session)):
    horses = session.exec(select(Horse)).all()

    responses = []
    for horse in horses:
        breed = session.get(Breed, horse.breed_id)
        owner = session.get(OwnerInfo, horse.owner_id)
        barn = session.get(Barn, horse.barn_id) if horse.barn_id else None
        pasture = session.get(Pasture, horse.pasture_id) if horse.pasture_id else None

        responses.append(
            HorseResponse(
                horse_id=horse.horse_id,
                horse_name=horse.horse_name,
                owner_name = owner.owner_name,
                breed = breed.name,
                sex = horse.sex,
                birthdate=horse.birthdate,
                height=horse.height,
                weight=horse.weight,

                location_type = horse.location_type,
                turnout_type = horse.turnout_type,
                barn=barn.name if horse.location_type == "stall" else None,
                pasture_name=pasture.name if pasture else None,
                stall_id=horse.stall_id if horse.location_type == "stall" else None,

                escape_risk = horse.escape_risk,
                may_bite = horse.may_bite,
                may_kick = horse.may_kick,
                difficult_to_catch = horse.difficult_to_catch,
                herd_dominant = horse.herd_dominant,
                sedation_required = horse.sedation_required,
                food_aggressive = horse.food_aggressive,
                requires_experienced_handler = horse.requires_experienced_handler,

                temperament=horse.temperament,
                notes=horse.notes,
                image=horse.image,

                created_at=horse.created_at,
                updated_at=horse.updated_at
            )
        )
    return responses

@router.get("/{horse_id}", response_model=HorseResponse)
def get_horse(horse_id: str, session: Session = Depends(get_session)):
    horse = session.exec(
        select(Horse).where(Horse.horse_id == horse_id)
    ).first()

    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    breed = session.get(Breed, horse.breed_id)
    owner = session.get(OwnerInfo, horse.owner_id)
    barn = session.get(Barn, horse.barn_id) if horse.barn_id else None
    pasture = session.get(Pasture, horse.pasture_id) if horse.pasture_id else None

    return HorseResponse(
        horse_id=horse.horse_id,
        horse_name=horse.horse_name,
        owner_name=owner.owner_name if owner else "",
        breed=breed.name if breed else "",
        sex=horse.sex,
        birthdate=horse.birthdate,
        height=horse.height,
        weight=horse.weight,

        location_type=horse.location_type,
        turnout_type=horse.turnout_type,
        barn=barn.name if horse.location_type == "stall" and barn else None,
        pasture_name=pasture.name if pasture else None,
        stall_id=horse.stall_id if horse.location_type == "stall" else None,

        escape_risk=horse.escape_risk,
        may_bite=horse.may_bite,
        may_kick=horse.may_kick,
        difficult_to_catch=horse.difficult_to_catch,
        herd_dominant=horse.herd_dominant,
        sedation_required=horse.sedation_required,
        food_aggressive=horse.food_aggressive,
        requires_experienced_handler=horse.requires_experienced_handler,

        temperament=horse.temperament,
        notes=horse.notes,
        image=horse.image,

        created_at=horse.created_at,
        updated_at=horse.updated_at
    )