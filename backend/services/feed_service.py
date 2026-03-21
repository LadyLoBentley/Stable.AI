from fastapi import HTTPException
from sqlmodel import Session, select

from models.horse import Horse
from models.feeding_regime import FeedingRegime
from models.inventory_items import InventoryItems

from schemas.feed_request import FeedRequest

def create_feed_regime(
    session: Session,
    submission: FeedRequest,
) -> FeedingRegime:

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

    # Map the horse name to the horse id found in Horse table
    horse = session.exec(
        select(Horse).where(Horse.horse_name == submission.horseName,
                            Horse.birthdate == submission.birthdate)
    ).first()

    if not horse:
        raise HTTPException(
            status_code=404,
            detail=f"Horse {submission.horseName} not found"
        )

    # If horse is given hay, map the hayType with inventory label to get id
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

    # Map grain type with grain label in inventory to find id
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

    feeding_regime = FeedingRegime(
        horse_id=horse.horse_id,
        hay_id=hay_id,
        hay_replacement_id=hay_replacement_id,
        grain_id=grain.item_id,
        food_additive_id=food_additive_id,

        feed_hay=submission.feedHay,
        hay_amount=submission.hayAmount,
        hay_unit="flake",
        replacement_amount=submission.replacementAmount,
        replacement_unit=submission.replacementUnit,

        grain_amount = submission.grainAmount,
        grain_unit = submission.grainUnit,
        add_food_additive = submission.addFoodAdditive,
        additive_amount = submission.additiveAmount,
        additive_unit = submission.additiveUnit,

        must_separate = submission.mustSeparate,
        soak_feed = submission.soakFeed,
        hay_net=submission.hayNet,
        feeding_instructions = submission.feedingInstructions
    )

    session.add(feeding_regime)
    session.commit()
    session.refresh(feeding_regime)

    return feeding_regime


