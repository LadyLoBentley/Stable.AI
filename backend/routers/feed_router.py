from fastapi import APIRouter, Depends
from sqlmodel import Session

from db.database import get_session
from schemas.feed_request import FeedRequest
from schemas.feed_response import FeedResponse
from services.feed_service import create_feed_regime as create_feed_regime_service

router = APIRouter(prefix="/feed", tags=["Feed"])

@router.post("/", response_model=FeedResponse)
def add_feed_regime(
    submission: FeedRequest,
    session: Session = Depends(get_session),
):
    feed_regime = create_feed_regime_service(session=session, submission=submission)

    return FeedResponse(
        horse_name=submission.horseName,
        birthdate=submission.birthdate,

        feed_hay=feed_regime.feed_hay,
        hay_type=submission.hayType,
        hay_amount=feed_regime.hay_amount,
        hay_unit=feed_regime.hay_unit,
        hay_replacement=submission.hayReplacement,
        replacement_amount=feed_regime.replacement_amount,
        replacement_unit=feed_regime.replacement_unit,

        grain_type=submission.grainType,
        grain_amount=feed_regime.grain_amount,
        grain_unit=feed_regime.grain_unit,
        add_food_additive=feed_regime.add_food_additive,
        food_additive=submission.foodAdditive,
        food_additive_amount=feed_regime.additive_amount,
        additive_unit=feed_regime.additive_unit,

        must_separate=feed_regime.must_separate,
        soak_feed=feed_regime.soak_feed,
        hay_net=feed_regime.hay_net,
        feeding_instructions=feed_regime.feeding_instructions,

        created_at=feed_regime.created_at,
        updated_at=feed_regime.updated_at,
    )