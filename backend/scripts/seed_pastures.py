from sqlmodel import Session, select
from db.database import create_db_and_tables, engine
from models.Pasture import Pasture

pastures = [
    {
        "name": "Mares Meadow",
        "type": "group",
        "max_horses": 6,
        "sex_restriction": "mare",
        "behavior_tag": "normal",
        "notes": "Turnout area for mares only."
    },
    {
        "name": "Geldings Field",
        "type": "group",
        "max_horses": 6,
        "sex_restriction": "gelding",
        "behavior_tag": "normal",
        "notes": "Turnout area for geldings."
    },
    {
        "name": "Stallion Paddock",
        "type": "restricted",
        "max_horses": 1,
        "sex_restriction": "stallion",
        "behavior_tag": "isolated",
        "notes": "Separate turnout area for stallions."
    },
    {
        "name": "Daycare Meadow",
        "type": "group",
        "max_horses": 8,
        "sex_restriction": "any",
        "behavior_tag": "playful",
        "notes": "For young or high-energy horses that socialize well."
    },
    {
        "name": "Senior Commune",
        "type": "group",
        "max_horses": 6,
        "sex_restriction": "any",
        "behavior_tag": "calm",
        "notes": "Low-energy pasture for senior horses."
    },
    {
        "name": "Easy Keepers Field",
        "type": "diet",
        "max_horses": 4,
        "sex_restriction": "any",
        "behavior_tag": "weight_management",
        "notes": "Lower grass turnout for horses that gain weight easily."
    },
    {
        "name": "Solo Pasture",
        "type": "individual",
        "max_horses": 1,
        "sex_restriction": "any",
        "behavior_tag": "food_aggressive",
        "notes": "Used for horses that cannot safely share turnout."
    },
    {
        "name": "Medical Field",
        "type": "restricted",
        "max_horses": 2,
        "sex_restriction": "any",
        "behavior_tag": "medical",
        "notes": "Reserved for injured or recovering horses."
    },
    {
        "name": "Pony Paddock",
        "type": "group",
        "max_horses": 5,
        "sex_restriction": "any",
        "behavior_tag": "pony",
        "notes": "Turnout for ponies or smaller horses."
    },
    {
        "name": "Spicy Horse Pasture",
        "type": "behavior",
        "max_horses": 3,
        "sex_restriction": "any",
        "behavior_tag": "aggressive",
        "notes": "For dominant or agitator horses that cannot mix with calmer groups."
    }
]

def seed_pastures():
    create_db_and_tables()

    with Session(engine) as session:
        for pasture_data in pastures:
            existing = session.exec(
                select(Pasture).where(Pasture.name == pasture_data["name"])
            ).first()

            if not existing:
                session.add(Pasture(**pasture_data))

        session.commit()
        print("Pastures seeded successfully.")

if __name__ == "__main__":
    seed_pastures()