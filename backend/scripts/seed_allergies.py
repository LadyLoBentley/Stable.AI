from sqlmodel import Session, select
from db.database import create_db_and_tables, engine
from models.Allergies import Allergies

allergies = [
    {
        "name": "Insect Bite Hypersensitivity",
        "category": "Skin",
        "description": "Horse has an allergic reaction to insect bites, especially midges, gnats, mosquitoes, or flies. This condition commonly causes intense itching and skin irritation, especially around the mane, tail, belly, face, and withers. Symptoms may worsen during warm months or in areas with high insect activity.",
        "management_notes": "Use fly protection consistently, including fly sheets, fly masks, and approved repellents as directed. Reduce insect exposure during peak activity times such as dawn and dusk when possible. Monitor for mane rubbing, tail rubbing, hair loss, crusting, scabs, skin thickening, or open sores from self-trauma. Keep horse as comfortable as possible and notify barn manager if itching becomes severe, skin breaks open, or secondary infection is suspected."
    },
    {
        "name": "Pollen Allergy",
        "category": "Environmental",
        "description": "Horse is sensitive to airborne pollen from grasses, weeds, or trees. Signs may be seasonal and can include itchy skin, watery eyes, nasal irritation, coughing, or worsening respiratory sensitivity depending on the severity of the reaction.",
        "management_notes": "Monitor closely during high pollen seasons and note whether symptoms worsen at certain times of year or after turnout. Reduce exposure when practical by adjusting turnout timing, avoiding heavily pollinating areas, and keeping barn ventilation appropriate without increasing dust exposure. Watch for itchy skin, tearing, nasal discharge, coughing, or increased respiratory effort. Report persistent or worsening signs to the barn manager or veterinarian."
    },
    {
        "name": "Dust Allergy",
        "category": "Respiratory",
        "description": "Horse has sensitivity to dust commonly found in hay, bedding, feed, barns, or indoor air. This allergy may contribute to coughing, nasal irritation, breathing discomfort, or general respiratory inflammation, especially in enclosed or poorly ventilated environments.",
        "management_notes": "Minimize dust exposure by avoiding dusty hay, dusty bedding, and unnecessary barn dust when possible. Soak hay for 30 minutes if directed in the feeding or care plan. Ensure stall and barn areas are well ventilated. Avoid sweeping, shaking hay, or cleaning dusty spaces near the horse when possible. Monitor for coughing, flared nostrils, nasal discharge, heavy breathing, or reduced exercise tolerance, and report respiratory changes promptly."
    },
    {
        "name": "Mold Sensitivity",
        "category": "Respiratory",
        "description": "Horse is sensitive to mold spores that may be present in hay, bedding, feed, damp stalls, or poorly ventilated storage areas. Mold sensitivity can cause respiratory irritation and may worsen coughing, nasal discharge, or breathing difficulty.",
        "management_notes": "Do not feed moldy hay, spoiled grain, or damp feed. Check hay and bedding carefully for odor, discoloration, excess dust, or visible mold growth. Keep feed storage areas dry and well ventilated. Monitor horse for coughing, nasal discharge, heavy breathing, or reduced comfort in the stall. Report any suspected mold exposure or change in respiratory status to the barn manager immediately."
    },
    {
        "name": "Bedding Sensitivity",
        "category": "Contact",
        "description": "Horse develops skin or respiratory irritation from certain bedding materials such as straw, shavings, pellets, or dusty bedding products. Signs may include coughing, itching, skin irritation, watery eyes, or discomfort after stall exposure.",
        "management_notes": "Use the bedding type approved for this horse and avoid switching without direction. Keep stall clean, dry, and well ventilated. Monitor for coughing, watery eyes, itching, hives, or skin irritation after stall time or bedding changes. If symptoms increase after exposure to fresh bedding, report it to the barn manager. Do not assume all bedding types are tolerated equally for sensitive horses."
    },
    {
        "name": "Feed Allergy or Feed Sensitivity",
        "category": "Digestive",
        "description": "Horse may react poorly to certain feed ingredients, additives, or supplements. Reactions may involve skin changes, digestive upset, irritability, or general discomfort rather than a dramatic immediate allergy response. Common triggers may include certain grains, additives, protein sources, or highly processed feeds.",
        "management_notes": "Feed only the approved diet and do not introduce new grain, supplements, or treats without authorization. Monitor for loose manure, reduced appetite, bloating, skin irritation, hives, or unusual behavior after feed changes. Introduce any necessary dietary changes gradually and only according to the feeding plan. Report suspected feed reactions, refusal to eat, or repeat digestive upset to the barn manager."
    },
    {
        "name": "Hay Sensitivity",
        "category": "Digestive",
        "description": "Horse appears sensitive to certain hay types, hay quality, or hay dust. Symptoms may include coughing, nasal irritation, poor appetite, digestive upset, or changes in manure depending on the specific trigger and type of sensitivity involved.",
        "management_notes": "Use the hay type specified in the feeding plan and avoid substitutions unless approved. Check hay quality before feeding and do not feed hay that is dusty, moldy, or spoiled. Soak hay if directed for dust control or respiratory support. Monitor for coughing, nasal discharge, reduced appetite, manure changes, or increased discomfort after feeding. Notify barn manager if symptoms seem linked to a particular hay batch or hay type."
    },
    {
        "name": "Medication Sensitivity",
        "category": "Medication",
        "description": "Horse has a history of reacting poorly to certain medications, topical products, sprays, or active ingredients. Reactions may include hives, swelling, itching, digestive upset, or abnormal behavior depending on the medication involved.",
        "management_notes": "Review medication instructions and allergy history before administering any treatment. Do not give unapproved medications, sprays, ointments, or supplements. Monitor closely after administration for hives, swelling, itching, diarrhea, agitation, facial puffiness, or respiratory distress. Report any suspected adverse reaction immediately and discontinue only under veterinary or barn manager direction when appropriate."
    },
    {
        "name": "Topical Product Sensitivity",
        "category": "Skin",
        "description": "Horse is sensitive to topical sprays, shampoos, ointments, liniments, or grooming products. Skin may react with redness, irritation, itching, hives, or discomfort after product application.",
        "management_notes": "Use only approved grooming and treatment products for this horse. Apply new or prescribed products exactly as directed and monitor the application site closely. Watch for redness, raised bumps, itching, heat, swelling, hair loss, or worsening skin irritation after use. If a reaction occurs, notify the barn manager and avoid reapplying the product unless specifically instructed."
    },
    {
        "name": "Sun Sensitivity",
        "category": "Skin",
        "description": "Horse is prone to skin irritation or photosensitivity from sunlight, especially on pink skin, white markings, or lightly pigmented areas. In some cases, sun sensitivity may also be worsened by certain plants, medications, or liver-related issues.",
        "management_notes": "Limit prolonged sun exposure when possible, especially during peak sunlight hours. Use approved fly masks, UV-protective sheets, sunscreen, and/or shade access as directed. Monitor pink-skinned or lightly pigmented areas for redness, crusting, irritation, tenderness, or peeling. Report worsening skin lesions, unusual swelling, or persistent sensitivity to the barn manager or veterinarian."
    },
    {
        "name": "Hives or Urticaria Prone",
        "category": "Skin",
        "description": "Horse is prone to developing hives, also called urticaria, in response to allergens such as insects, feed ingredients, medications, plants, environmental irritants, or unknown triggers. Hives may appear suddenly and vary in severity.",
        "management_notes": "Monitor the horse daily for raised welts, swelling, itching, or sudden skin changes. Note whether hives appear after feed changes, medication use, turnout, insect exposure, or topical treatments. Do not introduce new products or feeds without approval. Report widespread hives, facial swelling, or any breathing difficulty immediately, as more serious allergic reactions require urgent veterinary attention."
    },
    {
        "name": "Eye Irritation Allergy",
        "category": "Eye",
        "description": "Horse is prone to allergic eye irritation from dust, pollen, insects, or environmental exposure. Symptoms may include tearing, squinting, mild swelling, rubbing, or watery discharge.",
        "management_notes": "Keep the horse’s environment as low-irritant as possible and use approved fly masks if recommended. Monitor for tearing, squinting, puffiness, redness, rubbing, or discharge. Do not apply eye medications unless specifically approved for that horse. Report worsening swelling, thick discharge, eye cloudiness, or marked pain immediately since more serious eye issues can look similar at first."
    },
    {
        "name": "Pasture or Plant Sensitivity",
        "category": "Environmental",
        "description": "Horse may react to certain grasses, weeds, or plants encountered during turnout. Reactions may involve skin irritation, hives, photosensitivity, or general allergic flare-ups depending on the trigger.",
        "management_notes": "Monitor whether symptoms worsen after turnout, especially in certain fields, seasons, or overgrown areas. Avoid turnout in known problem areas when possible. Watch for itching, hives, swelling, skin irritation, or unusual sensitivity after grazing. Report suspected plant-related reactions so turnout routines or pasture access can be adjusted if needed."
    },
    {
        "name": "Sweet Itch",
        "category": "Skin",
        "description": "Seasonal allergic skin condition caused by hypersensitivity to insect bites, especially biting midges, often resulting in severe itching and rubbing.",
        "management_notes": "Use fly protection consistently, including fly sheets, fly masks, and approved repellents as directed. Limit turnout during peak insect activity when possible, especially at dawn and dusk. Monitor for mane rubbing, tail rubbing, hair loss, scabbing, skin thickening, or self-trauma. Keep horse comfortable and report worsening itching, open sores, or signs of skin infection promptly."
    },

]

def seed_allergies():
    create_db_and_tables()

    with Session(engine) as session:
        for allergy_data in allergies:
            existing = session.exec(
                select(Allergies).where(Allergies.name == allergy_data["name"])
            ).first()

            if not existing:
                session.add(Allergies(**allergy_data))

        session.commit()
        print("Allergies seeded successfully.")

if __name__ == "__main__":
    seed_allergies()
