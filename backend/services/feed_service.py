from fastapi import HTTPException
from sqlmodel import Session, select

from models.horse import Horse
from models.feeding_regime import FeedingRegime
from models.inventory_items import InventoryItems

from schemas.feed_request import FeedRequest


def get_feed_regime_by_horse_id(
    session: Session,
    horse_id: str,
) -> FeedingRegime | None:
    return session.exec(
        select(FeedingRegime)
        .where(FeedingRegime.horse_id == horse_id)
        .order_by(FeedingRegime.updated_at.desc(), FeedingRegime.created_at.desc())
    ).first()


def _validate_feed_submission(submission: FeedRequest) -> None:
    if submission.feedHay and not submission.hayType:
        raise HTTPException(
            status_code=400,
            detail="hayType is required when feedHay is true"
        )

    if not submission.feedHay and not submission.hayReplacement:
        raise HTTPException(
            status_code=400,
            detail="hayReplacement is required when feedHay is false"
        )

    if submission.addFoodAdditive and not submission.foodAdditive:
        raise HTTPException(
            status_code=400,
            detail="foodAdditive is required when addFoodAdditive is true"
        )


def _resolve_feed_inventory(
    session: Session,
    submission: FeedRequest,
) -> tuple[str | None, str | None, str, str | None]:
    hay_id = None
    hay_replacement_id = None

    if submission.feedHay:
        hay = session.exec(
            select(InventoryItems).where(
                InventoryItems.label == submission.hayType,
                InventoryItems.category == "Hay",
            )
        ).first()

        if not hay:
            raise HTTPException(
                status_code=404,
                detail=f"Hay type {submission.hayType} not found"
            )

        hay_id = hay.item_id

    else:
        hay_substitute = session.exec(
            select(InventoryItems).where(
                InventoryItems.label == submission.hayReplacement,
                InventoryItems.category == "Food Additive",
            )
        ).first()

        if not hay_substitute:
            raise HTTPException(
                status_code=404,
                detail=f"Substitute {submission.hayReplacement} not found"
            )

        hay_replacement_id = hay_substitute.item_id

    grain = session.exec(
        select(InventoryItems).where(
            InventoryItems.label == submission.grainType,
            InventoryItems.category == "Grain"
        )
    ).first()

    if not grain:
        raise HTTPException(status_code=404, detail=f"Grain {submission.grainType} not found")

    food_additive_id = None
    if submission.addFoodAdditive:
        food_additive = session.exec(
            select(InventoryItems).where(
                InventoryItems.label == submission.foodAdditive,
                InventoryItems.category == "Food Additive",
            )
        ).first()

        if not food_additive:
            raise HTTPException(
                status_code=404,
                detail=f"Food additive {submission.foodAdditive} not found"
            )

        food_additive_id = food_additive.item_id

    return hay_id, hay_replacement_id, grain.item_id, food_additive_id


def _save_feed_regime(
    session: Session,
    horse: Horse,
    submission: FeedRequest,
) -> FeedingRegime:
    _validate_feed_submission(submission)
    hay_id, hay_replacement_id, grain_id, food_additive_id = _resolve_feed_inventory(session, submission)

    feeding_regime = get_feed_regime_by_horse_id(session, horse.horse_id)

    if not feeding_regime:
        feeding_regime = FeedingRegime(horse_id=horse.horse_id)

    feeding_regime.hay_id = hay_id
    feeding_regime.hay_replacement_id = hay_replacement_id
    feeding_regime.grain_id = grain_id
    feeding_regime.food_additive_id = food_additive_id

    feeding_regime.feed_hay = submission.feedHay
    feeding_regime.hay_amount = submission.hayAmount
    feeding_regime.hay_unit = "flake"
    feeding_regime.replacement_amount = submission.replacementAmount
    feeding_regime.replacement_unit = submission.replacementUnit

    feeding_regime.grain_amount = submission.grainAmount
    feeding_regime.grain_unit = submission.grainUnit
    feeding_regime.add_food_additive = submission.addFoodAdditive
    feeding_regime.additive_amount = submission.additiveAmount
    feeding_regime.additive_unit = submission.additiveUnit

    feeding_regime.must_separate = submission.mustSeparate
    feeding_regime.soak_feed = submission.soakFeed
    feeding_regime.hay_net = submission.hayNet
    feeding_regime.feeding_instructions = submission.feedingInstructions

    session.add(feeding_regime)
    session.commit()
    session.refresh(feeding_regime)

    return feeding_regime

def create_feed_regime(
    session: Session,
    submission: FeedRequest,
) -> FeedingRegime:
    horse = session.exec(
        select(Horse).where(Horse.horse_name == submission.horseName,
                            Horse.birthdate == submission.birthdate)
    ).first()

    if not horse:
        raise HTTPException(
            status_code=404,
            detail=f"Horse {submission.horseName} not found"
        )

    return _save_feed_regime(session, horse, submission)


def update_feed_regime(
    session: Session,
    horse_id: str,
    submission: FeedRequest,
) -> FeedingRegime:
    horse = session.get(Horse, horse_id)

    if not horse:
        raise HTTPException(status_code=404, detail="Horse not found")

    return _save_feed_regime(session, horse, submission)

