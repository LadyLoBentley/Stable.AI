from sqlmodel import Session, select
from db.database import create_db_and_tables, engine
from models.health_conditions import HealthConditions

health_conditions = [
    {
        "name": "Colic Risk",
        "category": "Digestive",
        "description": "Horse has history of mild colic or digestive sensitivity.",
        "management_notes": "Monitor closely for reduced appetite, pawing, flank watching, rolling, bloating, or manure changes. Avoid sudden feed changes and introduce new hay or grain gradually. Ensure horse has consistent access to fresh water and regular turnout or movement when appropriate. Feed on a consistent schedule and report any signs of abdominal discomfort to the barn manager or veterinarian immediately."
    },
    {
        "name": "Ulcer Prone",
        "category": "Digestive",
        "description": "Horse prone to gastric ulcers.",
        "management_notes": "Provide regular forage access and avoid long periods with an empty stomach. Reduce stress where possible and maintain a consistent feeding schedule. Limit unnecessary high-starch grain intake and consider feeds or supplements designed for digestive support if approved. Monitor for girthiness, irritability, poor appetite, weight loss, dull coat, or decline in performance. Notify barn manager if symptoms worsen."
    },
    {
        "name": "Choke Risk",
        "category": "Digestive",
        "description": "Horse has history of choke episodes.",
        "management_notes": "All grain should be soaked for 30 minutes before feeding unless otherwise directed. Encourage slower eating by using soaked feed, larger feed pans, or slow-feeder methods when appropriate. Monitor during meals for coughing, nasal discharge with feed material, gagging, or repeated swallowing attempts. Do not feed dry pellets or dry grain if the horse has an active choking history unless specifically approved. Contact barn manager or veterinarian immediately if choke is suspected."
    },
    {
        "name": "Insulin Resistant",
        "category": "Metabolic",
        "description": "Horse has metabolic sensitivity to sugars.",
        "management_notes": "Feed a low NSC diet and avoid sweet feeds, molasses-heavy concentrates, and high-sugar treats. Restrict pasture access if required, especially during times of rich grass growth. Use low-starch feed options or ration balancers when extra nutrition is needed. Monitor body condition, crestiness, and hoof comfort. Watch for signs associated with laminitis such as heat in the feet, reluctance to move, or soreness, and report concerns promptly."
    },
    {
        "name": "PPID (Cushing's)",
        "category": "Metabolic",
        "description": "Hormonal disorder common in senior horses.",
        "management_notes": "Horse may require daily medication on a consistent schedule and may need closer monitoring for weight changes, abnormal coat retention, increased drinking, increased urination, lethargy, or recurrent infections. Senior feeding support may be needed depending on condition and dentition. Monitor for signs of laminitis and report missed medication, appetite changes, or unusual behavior to the barn manager."
    },
    {
        "name": "Arthritis",
        "category": "Musculoskeletal",
        "description": "Joint inflammation causing stiffness.",
        "management_notes": "Horse may appear stiff when first moving, especially after stall rest or in cold weather. Light regular movement is often better tolerated than long periods of inactivity unless otherwise directed. Observe for swelling, uneven gait, reluctance to turn, resistance under saddle, or changes in comfort level. Follow medication or supplement instructions exactly if prescribed. Notify barn manager if lameness worsens or daily mobility changes noticeably."
    },
    {
        "name": "Laminitis Risk",
        "category": "Musculoskeletal",
        "description": "Horse prone to hoof inflammation.",
        "management_notes": "Restrict access to high-sugar feeds, rich pasture, and unnecessary treats unless specifically approved. Feed low-starch, low-sugar forage and concentrates where applicable. Monitor for heat in the hooves, increased digital pulse, reluctance to move, shortened stride, rocking back on hind end, or soreness on hard ground. Weight management is important. Report any signs of foot pain or sudden movement changes immediately."
    },
    {
        "name": "Respiratory Sensitive",
        "category": "Respiratory",
        "description": "Horse sensitive to dust or allergens.",
        "management_notes": "Reduce dust exposure by avoiding moldy or dusty hay and bedding. Soak hay for 30 minutes if dusty or if instructed in the feeding plan. Keep feeding and stall areas well ventilated. Monitor for coughing, nasal discharge, heavy breathing, exercise intolerance, or flared nostrils. Avoid sweeping or shaking dusty materials near the horse when possible. Notify barn manager if breathing changes or cough becomes frequent."
    },
    {
        "name": "Thrush Prone",
        "category": "Hoof",
        "description": "Horse prone to bacterial hoof infections.",
        "management_notes": "Maintain a clean, dry stall and avoid prolonged standing in wet or manure-heavy areas. Pick out feet regularly and check for foul odor, black discharge, tenderness, or deep sulcus changes in the frog. Apply hoof treatments as directed and report worsening odor, pain, or sensitivity. Monitor hoof condition consistently, especially during wet weather or turnout in muddy areas."
    },
    {
        "name": "Injury Rehab",
        "category": "Musculoskeletal",
        "description": "Horse recovering from injury.",
        "management_notes": "Follow the rehabilitation plan exactly as assigned, including turnout limits, hand-walking schedule, exercise restrictions, and medication instructions. Do not increase workload or turnout without approval. Monitor daily for swelling, heat, pain response, uneven movement, or setback in recovery progress. Record notable changes and notify barn manager or veterinarian if the horse appears more lame, uncomfortable, or reactive than usual."
    }
]

def seed_health_conditions():
    create_db_and_tables()

    with Session(engine) as session:
        for condition_data in health_conditions:
            existing = session.exec(
                select(HealthConditions).where(HealthConditions.name == condition_data["name"])
            ).first()

            if not existing:
                session.add(HealthConditions(**condition_data))

        session.commit()
        print("Health conditions seeded successfully.")

if __name__ == "__main__":
    seed_health_conditions()