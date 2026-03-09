from sqlmodel import Session, select
from db.database import create_db_and_tables, engine
from models.Barn import Barn

barns = [
    {
        "name": "Main Barn",
        "type": "general",
        "max_stalls": 12,
        "use_tag": "primary",
        "notes": "Primary barn for daily housing and general operations."
    },
    {
        "name": "Sweet Feed Barn",
        "type": "general",
        "max_stalls": 8,
        "use_tag": "overflow",
        "notes": "Secondary barn used for regular housing."
    },
    {
        "name": "Blue Ribbon Barn",
        "type": "show",
        "max_stalls": 6,
        "use_tag": "performance",
        "notes": "Barn for performance or show horses."
    },
    {
        "name": "Foal Barn",
        "type": "specialty",
        "max_stalls": 5,
        "use_tag": "young_horses",
        "notes": "Used for foals, young horses, or mares with special needs."
    },
    {
        "name": "Pony Barn",
        "type": "specialty",
        "max_stalls": 4,
        "use_tag": "pony",
        "notes": "Barn designated for ponies or smaller horses."
    },
    {
        "name": "Quarantine Barn",
        "type": "restricted",
        "max_stalls": 3,
        "use_tag": "medical_isolation",
        "notes": "Restricted barn for isolation, intake, or contagious risk cases."
    }
]

def seed_barns():
    create_db_and_tables()

    with Session(engine) as session:
        for barn_data in barns:
            existing = session.exec(
                select(Barn).where(Barn.name == barn_data["name"])
            ).first()

            if not existing:
                session.add(Barn(**barn_data))

        session.commit()
        print("Barns seeded successfully.")

if __name__ == "__main__":
    seed_barns()