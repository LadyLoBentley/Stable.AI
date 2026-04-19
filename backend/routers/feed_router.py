from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from models.horse import Horse
from models.inventory_items import InventoryItems
from db.database import get_session
from schemas.feed_request import FeedRequest
from schemas.feed_response import FeedResponse
from services.feed_service import (
    create_feed_regime as create_feed_regime_service,
    update_feed_regime as update_feed_regime_service,
    get_feed_regime_by_horse_id,
)

router = APIRouter(prefix="/feed", tags=["Feed"])


def build_feed_response(
    session: Session,
    horse: Horse,
    feed_regime,
) -> FeedResponse:
    hay = session.get(InventoryItems, feed_regime.hay_id) if feed_regime.hay_id else None
    hay_replacement = session.get(InventoryItems, feed_regime.hay_replacement_id) if feed_regime.hay_replacement_id else None
    grain = session.get(InventoryItems, feed_regime.grain_id) if feed_regime.grain_id else None
    additive = session.get(InventoryItems, feed_regime.food_additive_id) if feed_regime.food_additive_id else None

    return FeedResponse(
        horse_name=horse.horse_name,
        birthdate=horse.birthdate,

        feed_hay=feed_regime.feed_hay,
        hay_type=hay.label if hay else None,
        hay_amount=feed_regime.hay_amount,
        hay_unit=feed_regime.hay_unit,
        hay_replacement=hay_replacement.label if hay_replacement else None,
        replacement_amount=feed_regime.replacement_amount,
        replacement_unit=feed_regime.replacement_unit,

        grain_type=grain.label if grain else None,
        grain_amount=feed_regime.grain_amount,
        grain_unit=feed_regime.grain_unit,
        add_food_additive=feed_regime.add_food_additive,
        food_additive=additive.label if additive else None,
        food_additive_amount=feed_regime.additive_amount,
        additive_unit=feed_regime.additive_unit,

        must_separate=feed_regime.must_separate,
        soak_feed=feed_regime.soak_feed,
        hay_net=feed_regime.hay_net,
        feeding_instructions=feed_regime.feeding_instructions,

        created_at=feed_regime.created_at,
        updated_at=feed_regime.updated_at
    )

@router.post("/", response_model=FeedResponse)
def add_feed_regime(
    submission: FeedRequest,
    session: Session = Depends(get_session),
):
    feed_regime = create_feed_regime_service(session=session, submission=submission)
    horse = session.get(Horse, feed_regime.horse_id)

    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    return build_feed_response(session, horse, feed_regime)


@router.put("/{horse_id}", response_model=FeedResponse)
def edit_feed_regime(
    horse_id: str,
    submission: FeedRequest,
    session: Session = Depends(get_session),
):
    horse = session.get(Horse, horse_id)

    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    feed_regime = update_feed_regime_service(
        session=session,
        horse_id=horse_id,
        submission=submission
    )

    return build_feed_response(session, horse, feed_regime)

@router.get("/{horse_id}", response_model=FeedResponse)
def get_feed_regime(
    horse_id: str,
    session: Session = Depends(get_session),
):
    # Get horse
    horse = session.get(Horse, horse_id)
    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    feed_regime = get_feed_regime_by_horse_id(session, horse_id)

    if not feed_regime:
        raise HTTPException(status_code=404, detail="Feed regime not found")

    return build_feed_response(session, horse, feed_regime)
