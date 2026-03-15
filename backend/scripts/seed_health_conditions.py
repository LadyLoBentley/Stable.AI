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
        "name": "Sensitive Digestion",
        "category": "Digestive",
        "description": "Horse has a sensitive digestive system and may react to feed changes.",
        "management_notes": "Avoid sudden changes to grain or hay. Introduce any new feed gradually over 7–14 days when possible. Maintain a consistent feeding schedule and monitor for loose manure, reduced appetite, mild colic signs, or weight fluctuations. Ensure consistent access to clean water and forage. Report digestive changes or abnormal manure to the barn manager."
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
        "name": "Rain Rot Prone",
        "category": "Skin",
        "description": "Horse is prone to rain rot or moisture-related skin irritation.",
        "management_notes": "Keep the horse as dry as possible and avoid leaving moisture trapped under blankets or against the coat. Monitor for scabs, crusting, hair loss, or skin sensitivity, especially after wet weather. Use topical treatments only as directed and report worsening lesions, spreading irritation, or signs of infection to the barn manager or veterinarian."
    },
    {
        "name": "Injury Rehab",
        "category": "Musculoskeletal",
        "description": "Horse recovering from injury.",
        "management_notes": "Follow the rehabilitation plan exactly as assigned, including turnout limits, hand-walking schedule, exercise restrictions, and medication instructions. Do not increase workload or turnout without approval. Monitor daily for swelling, heat, pain response, uneven movement, or setback in recovery progress. Record notable changes and notify barn manager or veterinarian if the horse appears more lame, uncomfortable, or reactive than usual."
    },
    {
        "name": "Equine Asthma",
        "category": "Respiratory",
        "description": "Chronic inflammatory airway condition that may cause coughing, nasal discharge, exercise intolerance, or labored breathing, especially in dusty environments.",
        "management_notes": "Reduce dust exposure as much as possible by avoiding dusty hay, moldy bedding, and poorly ventilated spaces. Soak or steam hay if directed in the care plan. Monitor for coughing, nasal discharge, flared nostrils, increased breathing effort, or reduced exercise tolerance. Avoid sweeping or moving dusty materials near the horse. Follow prescribed inhaled or oral medication instructions exactly if applicable. Notify barn manager or veterinarian promptly if breathing becomes more difficult or symptoms worsen."
    },
    {
        "name": "Equine Metabolic Syndrome (EMS)",
        "category": "Metabolic",
        "description": "Metabolic disorder associated with abnormal fat deposits, insulin dysregulation, and increased risk of laminitis.",
        "management_notes": "Feed a low NSC diet and restrict access to rich pasture, grain, and sugary treats unless otherwise directed. Monitor body condition closely, especially fat deposits along the crest, tailhead, and shoulders. Weight control and consistent exercise are often important if approved by the veterinarian. Watch carefully for signs of laminitis such as heat in the feet, increased digital pulse, stiffness, or reluctance to move, and report concerns immediately."
    },
    {
        "name": "Navicular Syndrome",
        "category": "Musculoskeletal",
        "description": "Chronic hoof-related condition often associated with heel pain, altered gait, and intermittent or ongoing front-end lameness.",
        "management_notes": "Monitor for shortened stride, stumbling, toe-first landing, reluctance to work, or increased sensitivity on hard ground. Maintain consistent farrier care according to the prescribed trimming or shoeing plan. Avoid unnecessary work on hard or uneven footing if the horse is uncomfortable. Follow medication and exercise recommendations as directed. Notify barn manager if lameness worsens or hoof comfort declines."
    },
    {
        "name": "Tendon or Ligament Injury History",
        "category": "Musculoskeletal",
        "description": "Horse has previous or ongoing tendon or ligament injury that may require controlled exercise, turnout limitations, or monitoring for re-injury.",
        "management_notes": "Follow rehabilitation, exercise, and turnout restrictions exactly as assigned. Monitor daily for swelling, heat, pain on palpation, shortened stride, uneven movement, or setback in recovery progress. Do not increase workload without approval. Use supportive wraps or therapies only as directed. Notify barn manager or veterinarian if any increase in swelling, pain, or lameness is observed."
    },
    {
        "name": "Hives or Urticaria Prone",
        "category": "Skin",
        "description": "Horse is prone to raised welts or skin reactions that may occur due to allergies, insect exposure, feed ingredients, medications, or environmental irritants.",
        "management_notes": "Monitor for sudden raised bumps, swelling, itching, or skin sensitivity. Watch for patterns after feed changes, medication administration, turnout, insect exposure, or topical product use. Report facial swelling, widespread hives, or any breathing difficulty immediately. Do not introduce new feed, medications, or grooming products without approval if the horse has a history of skin reactions."
    },
    {
        "name": "Chronic Dry Eye",
        "category": "Eye",
        "description": "Horse has recurring or ongoing dry eye or eye irritation that may require routine monitoring or medication.",
        "management_notes": "Administer eye medication only as directed and keep treatment schedule consistent if prescribed. Monitor for squinting, tearing, redness, discharge, rubbing, or cloudiness. Use fly protection if recommended. Report worsening irritation, pain, swelling, or changes in appearance of the eye immediately, as eye issues can become serious quickly."
    },
    {
        "name": "Easy Keeper",
        "category": "Metabolic",
        "description": "Horse gains weight easily and may require careful feed and pasture management to prevent obesity-related complications.",
        "management_notes": "Monitor body condition and weight trends closely. Limit unnecessary concentrates, rich pasture access, and sugary treats unless specifically approved. Feed forage and ration balancers according to the care plan. Horses that gain weight easily may be at greater risk for metabolic issues and laminitis, so report signs of foot soreness, stiffness, or sudden weight gain."
    },
    {
        "name": "Hard Keeper",
        "category": "Metabolic",
        "description": "Horse has difficulty maintaining weight and may require additional calories, careful feeding support, or closer monitoring.",
        "management_notes": "Monitor weight, appetite, body condition, and topline regularly. Feed according to the assigned nutrition plan and do not skip meals or forage access if possible. Track poor appetite, chewing difficulty, manure changes, or continued weight loss. Report unexplained weight loss, reduced appetite, or decline in condition to the barn manager or veterinarian."
    },
    {
        "name": "Neurologic History",
        "category": "Neurologic",
        "description": "Horse has a past or current neurologic condition that may affect coordination, balance, strength, or general safety in handling.",
        "management_notes": "Handle carefully and watch for stumbling, weakness, dragging toes, uneven coordination, abnormal posture, or changes in behavior. Follow turnout and exercise instructions exactly if restrictions apply. Use caution during leading, trailering, or work if balance or coordination is affected. Report any worsening neurologic signs immediately."
    },
    {
        "name": "Seizure History",
        "category": "Neurologic",
        "description": "Horse has a history of seizures or seizure-like episodes and may require closer observation and specific safety precautions.",
        "management_notes": "Monitor for unusual episodes, collapse, disorientation, muscle twitching, abnormal behavior, or post-episode weakness. Follow medication instructions exactly if prescribed. Reduce avoidable stressors if recommended. Report any seizure activity or abnormal neurologic behavior to the barn manager or veterinarian immediately."
    },
    {
        "name": "Vision Impaired",
        "category": "Neurologic",
        "description": "Horse has limited vision or partial blindness that may affect handling, turnout, confidence, and safety.",
        "management_notes": "Approach calmly and consistently, especially from the horse’s limited-vision side if known. Avoid sudden movements or startling contact. Keep the horse’s environment as predictable as possible and avoid unnecessary rearrangement of stall or turnout spaces. Monitor for bumping into objects, hesitancy, or anxiety. Inform handlers of visual limitations before working with the horse."
    },
    {
        "name": "Deaf or Hearing Impaired",
        "category": "Neurologic",
        "description": "Horse has partial or complete hearing impairment that may affect handling and response to voice cues.",
        "management_notes": "Approach where the horse can see you and avoid startling physical contact. Use clear visual cues and consistent handling routines. Inform handlers that the horse may not respond to voice commands or sounds as expected. Monitor for anxiety, startle responses, or confusion in busy environments."
    },
    {
        "name": "Anhidrosis",
        "category": "Metabolic",
        "description": "Horse has reduced ability or inability to sweat normally, increasing the risk of overheating in hot or humid conditions.",
        "management_notes": "Monitor carefully during warm weather or exercise for overheating, rapid breathing, elevated temperature, lethargy, or poor recovery. Provide shade, fresh water, airflow, and cooling measures as needed. Reduce exertion during heat and humidity if directed. Report signs of heat stress immediately."
    },
    {
        "name": "Lyme Disease History",
        "category": "Infectious",
        "description": "Horse has current or past Lyme disease diagnosis or concern, which may be associated with shifting lameness, stiffness, lethargy, or behavioral changes.",
        "management_notes": "Monitor for stiffness, sensitivity, unexplained lameness, lethargy, or changes in comfort and behavior. Follow treatment instructions exactly if the horse is under veterinary care. Report worsening symptoms, reduced comfort, or changes in performance to the barn manager or veterinarian."
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