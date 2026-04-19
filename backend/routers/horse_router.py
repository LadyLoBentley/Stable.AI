from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlmodel import Session, select

from db.database import get_session

from schemas.horse_request import HorseRequest
from schemas.horse_response import HorseResponse

from services.horse_storage_service import upload_horse_image
from services.horse_service import create_horse, update_horse

from models.horse import Horse
from models.breed import Breed
from models.barn import Barn
from models.pasture import Pasture
from models.owner import OwnerInfo

router = APIRouter(prefix="/horses", tags=["horses"])


def build_horse_response(session: Session, horse: Horse) -> HorseResponse:
    breed = session.get(Breed, horse.breed_id)
    owner = session.get(OwnerInfo, horse.owner_id)
    barn = session.get(Barn, horse.barn_id) if horse.barn_id else None
    pasture = session.get(Pasture, horse.pasture_id) if horse.pasture_id else None

    return HorseResponse(
        horse_id=horse.horse_id,
        owner_id=horse.owner_id,
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


@router.post("/", response_model=HorseResponse)
async def add_horse(
    horseName: str = Form(...),
    ownerName: str = Form(...),
    breed: str = Form(...),
    sex: str = Form(...),
    birthdate: date = Form(...),
    height: float = Form(...),
    weight: Optional[float] = Form(None),

    locationType: str = Form(...),
    turnoutType: str = Form(...),
    barn: Optional[str] = Form(None),
    stallId: Optional[str] = Form(None),
    pastureName: Optional[str] = Form(None),

    escapeRisk: bool = Form(False),
    mayBite: bool = Form(False),
    mayKick: bool = Form(False),
    difficultToCatch: bool = Form(False),
    herdDominant: bool = Form(False),
    sedationRequired: bool = Form(False),
    foodAggressive: bool = Form(False),
    requiresExperiencedHandler: bool = Form(False),

    temperament: Optional[str] = Form(None),
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
        difficultToCatch=difficultToCatch,
        herdDominant=herdDominant,
        sedationRequired=sedationRequired,
        foodAggressive=foodAggressive,
        requiresExperiencedHandler=requiresExperiencedHandler,

        temperament=temperament,
        notes=notes,
    )

    image_url = await upload_horse_image(image)
    horse = create_horse(session=session, submission=submission, image_url=image_url)
    return build_horse_response(session, horse)


@router.put("/{horse_id}", response_model=HorseResponse)
async def edit_horse(
    horse_id: str,
    horseName: str = Form(...),
    ownerName: str = Form(...),
    breed: str = Form(...),
    sex: str = Form(...),
    birthdate: date = Form(...),
    height: float = Form(...),
    weight: Optional[float] = Form(None),

    locationType: str = Form(...),
    turnoutType: str = Form(...),
    barn: Optional[str] = Form(None),
    stallId: Optional[str] = Form(None),
    pastureName: Optional[str] = Form(None),

    escapeRisk: bool = Form(False),
    mayBite: bool = Form(False),
    mayKick: bool = Form(False),
    difficultToCatch: bool = Form(False),
    herdDominant: bool = Form(False),
    sedationRequired: bool = Form(False),
    foodAggressive: bool = Form(False),
    requiresExperiencedHandler: bool = Form(False),

    temperament: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
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
        difficultToCatch=difficultToCatch,
        herdDominant=herdDominant,
        sedationRequired=sedationRequired,
        foodAggressive=foodAggressive,
        requiresExperiencedHandler=requiresExperiencedHandler,

        temperament=temperament,
        notes=notes,
    )

    image_url = None
    if image and image.filename:
        image_url = await upload_horse_image(image)

    horse = update_horse(
        session=session,
        horse_id=horse_id,
        submission=submission,
        image_url=image_url
    )

    return build_horse_response(session, horse)


@router.get("/", response_model=list[HorseResponse])
def get_horses(session: Session = Depends(get_session)):
    horses = session.exec(select(Horse)).all()
    return [build_horse_response(session, horse) for horse in horses]


@router.get("/{horse_id}", response_model=HorseResponse)
def get_horse(horse_id: str, session: Session = Depends(get_session)):
    horse = session.exec(
        select(Horse).where(Horse.horse_id == horse_id)
    ).first()

    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    return build_horse_response(session, horse)