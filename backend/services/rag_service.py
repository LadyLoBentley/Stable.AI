import ollama
from sqlmodel import Session, select

from db.database import engine
from models.horse import Horse
from models.owner import OwnerInfo
from models.medical_records import MedicalRecords
from models.barn import Barn
from models.pasture import Pasture
from models.feeding_regime import FeedingRegime
from models.medication import HorseMedication
from models.supplements import HorseSupplements
from models.inventory_items import InventoryItems

from rag.config import LLM_MODEL
from rag.prompt_builder import build_rag_prompt
from rag.vector_store import search_documents


def get_known_horse_names() -> list[str]:
    with Session(engine) as session:
        horses = session.exec(select(Horse)).all()
        return [
            horse.horse_name.lower()
            for horse in horses
            if getattr(horse, "horse_name", None)
        ]


def detect_category(question: str) -> str:
    q = question.lower()
    known_horse_names = get_known_horse_names()

    if any(phrase in q for phrase in [
        "can i ask about a specific horse",
        "ask about a specific horse",
        "how do i ask about a horse",
        "can i ask about a horse by name",
        "what kinds of questions can you answer",
        "what can you help with",
    ]):
        return "help"

    if any(word in q for word in ["owner", "owners", "contact", "contacts"]):
        return "owner"

    if any(word in q for word in ["medical", "vet", "vaccine", "vaccines", "farrier", "dentist"]):
        return "medical"

    if any(name in q for name in known_horse_names):
        return "horse"

    if any(word in q for word in ["horse", "horses",
        "feeding", "feed", "supplement", "supplements",
        "medication", "medications",
        "temperament", "turnout", "past injury", "injury", "injuries",
        "compatibility", "handler", "care instructions"
    ]):
        return "horse"

    if any(word in q for word in ["barn", "stall"]):
        return "barn"

    if any(word in q for word in ["pasture", "field"]):
        return "pasture"

    return "docs"


def detect_detail_level(question: str, category: str) -> str:
    q = question.lower()
    known_horse_names = get_known_horse_names()

    if any(name in q for name in known_horse_names):
        return "detailed"

    if category == "owner" and any(phrase in q for phrase in [
        "show owner details",
        "owner details",
        "full owner information",
        "emergency contact"
    ]):
        return "detailed"

    if category == "medical" and any(phrase in q for phrase in [
        "tell me about",
        "medical details",
        "full medical record",
        "medical notes",
        "vet info",
        "vaccines for"
    ]):
        return "detailed"

    if any(phrase in q for phrase in [
        "tell me about",
        "what do we have on",
        "what notes are on",
        "details on",
        "information on"
    ]):
        return "detailed"

    if any(phrase in q for phrase in [
        "currently in the system",
        "what horses do we have",
        "what horse records",
        "list horses",
        "show horses",
        "which horses",
        "what owner information",
        "what medical records",
        "what records are on file",
    ]):
        return "summary"

    return "summary"


def build_comprehensive_horse_context(horse: Horse, session: Session) -> str:
    owner = None
    if horse.owner_id:
        owner = session.exec(select(OwnerInfo).where(OwnerInfo.owner_id == horse.owner_id)).first()
        
    medical = session.exec(select(MedicalRecords).where(MedicalRecords.horse_id == horse.horse_id)).first()
    
    feed = session.exec(select(FeedingRegime).where(FeedingRegime.horse_id == horse.horse_id)).first()
    feed_str = "None"
    if feed:
        items = []
        if getattr(feed, 'hay_id', None):
            inv = session.exec(select(InventoryItems).where(InventoryItems.item_id == feed.hay_id)).first()
            items.append(f"Hay: {inv.label if inv else 'Unknown'} (Instructions: {inv.instructions if inv else 'None'}) Amount: {feed.hay_amount} {feed.hay_unit}")
        if getattr(feed, 'grain_id', None):
            inv = session.exec(select(InventoryItems).where(InventoryItems.item_id == feed.grain_id)).first()
            items.append(f"Grain: {inv.label if inv else 'Unknown'} (Instructions: {inv.instructions if inv else 'None'}) Amount: {feed.grain_amount} {feed.grain_unit}")
        if getattr(feed, 'food_additive_id', None):
            inv = session.exec(select(InventoryItems).where(InventoryItems.item_id == feed.food_additive_id)).first()
            items.append(f"Additive: {inv.label if inv else 'Unknown'} (Instructions: {inv.instructions if inv else 'None'}) Amount: {feed.additive_amount} {feed.additive_unit}")
        feed_str = "; ".join(items) + f" | Notes: {feed.feeding_instructions}"
    
    meds = session.exec(select(HorseMedication).where(HorseMedication.horse_id == horse.horse_id)).all()
    meds_str = "None"
    if meds:
        m_list = []
        for m in meds:
            inv = session.exec(select(InventoryItems).where(InventoryItems.item_id == m.item_id)).first()
            m_list.append(f"{inv.label if inv else 'Unknown'} (Instructions: {inv.instructions if inv else 'None'}) - {m.dosage_amount} {m.dosage_unit} {m.frequency_type}")
        meds_str = "; ".join(m_list)
        
    supps = session.exec(select(HorseSupplements).where(HorseSupplements.horse_id == horse.horse_id)).all()
    supps_str = "None"
    if supps:
        s_list = []
        for s in supps:
            inv = session.exec(select(InventoryItems).where(InventoryItems.item_id == s.item_id)).first()
            s_list.append(f"{inv.label if inv else 'Unknown'} (Instructions: {inv.instructions if inv else 'None'}) - {s.dosage_amount} {s.dosage_unit} {s.frequency_type}")
        supps_str = "; ".join(s_list)

    full_text = (
        f"Comprehensive Profile for {horse.horse_name}:\\n"
        f"- Basic Info: sex={horse.sex}, birthdate={horse.birthdate}, height={horse.height}, weight={horse.weight}, location={horse.location_type}, turnout={horse.turnout_type}, stall_id={horse.stall_id}, temperament={horse.temperament}, notes={horse.notes}\\n"
        f"- Behavior/Safety: bite={horse.may_bite}, kick={horse.may_kick}, difficult_to_catch={horse.difficult_to_catch}, herd_dominant={horse.herd_dominant}, sedation_required={horse.sedation_required}, food_aggressive={horse.food_aggressive}, needs_experienced_handler={horse.requires_experienced_handler}\\n"
    )
    if owner:
        full_text += f"- Owner Info: {owner.owner_name}, phone={owner.owner_phone}, email={owner.owner_email}, emergency_contact={owner.emergency_contact_name} ({owner.emergency_contact_phone})\\n"
    if medical:
        full_text += f"- Medical Info: vet={medical.vet_name} ({medical.vet_phone}), farrier={medical.farrier_name}, coggins_exp={medical.coggins_expiration}, rabies_exp={medical.rabies_expiration}, notes={medical.medical_notes}\\n"
    
    full_text += f"- Feeding Regime: {feed_str}\\n"
    full_text += f"- Medications: {meds_str}\\n"
    full_text += f"- Supplements: {supps_str}"
    return full_text

def get_matching_horses(question: str, horses: list[Horse]) -> list[Horse]:
    q = question.lower()
    matches = [
        horse for horse in horses
        if horse.horse_name and horse.horse_name.lower() in q
    ]
    return matches


def get_structured_context(question: str) -> list[dict]:
    category = detect_category(question)
    detail_level = detect_detail_level(question, category)
    structured_chunks = []

    with Session(engine) as session:
        if category == "horse":
            horses = session.exec(select(Horse)).all()

            if detail_level == "detailed":
                filtered_horses = get_matching_horses(question, horses)
                horses_to_use = filtered_horses[:3] if filtered_horses else horses[:3]
            else:
                horses_to_use = horses[:5]

            for horse in horses_to_use:
                if detail_level == "summary":
                    structured_chunks.append({
                        "text": (
                            f"Horse summary: "
                            f"name={horse.horse_name}, "
                            f"sex={horse.sex}, "
                            f"birthdate={horse.birthdate}"
                        ),
                        "metadata": {
                            "file_name": "database_horses",
                            "source_type": "structured_db"
                        }
                    })
                else:
                    structured_chunks.append({
                        "text": build_comprehensive_horse_context(horse, session),
                        "metadata": {
                            "file_name": "database_horses_comprehensive",
                            "source_type": "structured_db"
                        }
                    })

        elif category == "owner":
            owners = session.exec(select(OwnerInfo)).all()

            # If a horse name is mentioned, try to find that horse's owner
            horses = session.exec(select(Horse)).all()
            matching_horses = get_matching_horses(question, horses)

            if matching_horses:
                owner_ids = {horse.owner_id for horse in matching_horses}
                owners_to_use = [owner for owner in owners if owner.owner_id in owner_ids][:3]
                owner_detail_level = "detailed"
            else:
                owners_to_use = owners[:3]
                owner_detail_level = detail_level

            for owner in owners_to_use:
                if owner_detail_level == "summary":
                    structured_chunks.append({
                        "text": (
                            f"Owner summary: "
                            f"name={owner.owner_name}, "
                            f"phone={owner.owner_phone}, "
                            f"email={owner.owner_email}"
                        ),
                        "metadata": {
                            "file_name": "database_owners",
                            "source_type": "structured_db"
                        }
                    })
                else:
                    structured_chunks.append({
                        "text": (
                            f"Owner record: "
                            f"name={owner.owner_name}, "
                            f"phone={owner.owner_phone}, "
                            f"email={owner.owner_email}, "
                            f"emergency_contact_name={owner.emergency_contact_name}, "
                            f"emergency_contact_relation={owner.emergency_contact_relation}, "
                            f"emergency_contact_phone={owner.emergency_contact_phone}, "
                            f"street_address={owner.street_address}, "
                            f"apt_no={owner.apt_no}, "
                            f"city={owner.city}, "
                            f"state={owner.state}, "
                            f"zip={owner.zip}, "
                            f"signed_waiver={owner.signed_waiver}"
                        ),
                        "metadata": {
                            "file_name": "database_owners",
                            "source_type": "structured_db"
                        }
                    })

        elif category == "medical":
            records = session.exec(select(MedicalRecords)).all()
            horses = session.exec(select(Horse)).all()

            horse_lookup = {horse.horse_id: horse for horse in horses}
            matching_horses = get_matching_horses(question, horses)

            if matching_horses:
                horse_ids = {horse.horse_id for horse in matching_horses}
                records_to_use = [record for record in records if record.horse_id in horse_ids][:3]
                medical_detail_level = "detailed"
            else:
                records_to_use = records[:3]
                medical_detail_level = detail_level

            for record in records_to_use:
                horse = horse_lookup.get(record.horse_id)
                horse_name = horse.horse_name if horse else "Unknown horse"

                if medical_detail_level == "summary":
                    structured_chunks.append({
                        "text": (
                            f"Medical summary: "
                            f"horse_name={horse_name}, "
                            f"medical_record_on_file=yes, "
                            f"rabies_expiration={record.rabies_expiration}, "
                            f"tetanus_expiration={record.tetanus_expiration}, "
                            f"coggins_expiration={record.coggins_expiration}, "
                            f"medical_notes={record.medical_notes}"
                        ),
                        "metadata": {
                            "file_name": "database_medical_records",
                            "source_type": "structured_db"
                        }
                    })
                else:
                    structured_chunks.append({
                        "text": (
                            f"Medical record: "
                            f"horse_name={horse_name}, "
                            f"vet_clinic={record.vet_clinic}, "
                            f"vet_name={record.vet_name}, "
                            f"vet_phone={record.vet_phone}, "
                            f"is_same_vet={record.is_same_vet}, "
                            f"emergency_clinic={record.emergency_clinic}, "
                            f"emergency_vet_name={record.emergency_vet_name}, "
                            f"emergency_vet_phone={record.emergency_vet_phone}, "
                            f"emergency_authorization={record.emergency_authorization}, "
                            f"emergency_instructions={record.emergency_instructions}, "
                            f"rabies_expiration={record.rabies_expiration}, "
                            f"tetanus_expiration={record.tetanus_expiration}, "
                            f"eee_wee_expiration={record.eee_wee_expiration}, "
                            f"flu_rhino_expiration={record.flu_rhino_expiration}, "
                            f"coggins_expiration={record.coggins_expiration}, "
                            f"has_shoes={record.has_shoes}, "
                            f"farrier_name={record.farrier_name}, "
                            f"farrier_phone={record.farrier_phone}, "
                            f"farrier_date={record.farrier_date}, "
                            f"dentist_name={record.dentist_name}, "
                            f"dentist_phone={record.dentist_phone}, "
                            f"dental_date={record.dental_date}, "
                            f"chiropractor_name={record.chiropractor_name}, "
                            f"chiropractor_phone={record.chiropractor_phone}, "
                            f"chiropractor_date={record.chiropractor_date}, "
                            f"massage_therapist={record.massage_therapist}, "
                            f"therapist_phone={record.therapist_phone}, "
                            f"massage_date={record.massage_date}, "
                            f"deworm_provider={record.deworm_provider}, "
                            f"deworm_date={record.deworm_date}, "
                            f"medical_notes={record.medical_notes}"
                        ),
                        "metadata": {
                            "file_name": "database_medical_records",
                            "source_type": "structured_db"
                    }
                })

        elif category == "barn":
            barns = session.exec(select(Barn)).all()
            for barn in barns[:3]:
                structured_chunks.append({
                    "text": (
                        f"Barn record: "
                        f"name={getattr(barn, 'name', None)}, "
                        f"type={getattr(barn, 'type', None)}, "
                        f"notes={getattr(barn, 'notes', None)}"
                    ),
                    "metadata": {
                        "file_name": "database_barns",
                        "source_type": "structured_db"
                    }
                })

        elif category == "pasture":
            pastures = session.exec(select(Pasture)).all()
            for pasture in pastures[:3]:
                structured_chunks.append({
                    "text": (
                        f"Pasture record: "
                        f"name={getattr(pasture, 'name', None)}, "
                        f"type={getattr(pasture, 'type', None)}, "
                        f"notes={getattr(pasture, 'notes', None)}"
                    ),
                    "metadata": {
                        "file_name": "database_pastures",
                        "source_type": "structured_db"
                    }
                })

    return structured_chunks


def generate_rag_answer(question: str, top_k: int = 5) -> dict:
    category = detect_category(question)

    if category == "help":
        return {
            "question": question,
            "answer": (
                "Yes. You can ask about the horses in the system, owner information, "
                "medical records, feeding or barn rules, or ask about a specific horse by name. "
                "For medical, treatment, or legal decisions, please confirm with Ava, barn management, or the veterinarian."
            ),
            "sources": []
        }

    structured_matches = get_structured_context(question)

    vector_matches = []
    if category == "docs":
        vector_matches = search_documents(question, top_k=top_k)

    all_context = structured_matches + vector_matches
    prompt = build_rag_prompt(question, all_context)

    response = ollama.chat(
        model=LLM_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    answer = response["message"]["content"]

    unique_sources = []
    seen = set()

    for match in all_context:
        source_key = (
            match.get("metadata", {}).get("file_name"),
            match.get("metadata", {}).get("chunk_index"),
        )
        if source_key in seen:
            continue
        seen.add(source_key)

        unique_sources.append({
            "id": match.get("id"),
            "file_name": match.get("metadata", {}).get("file_name"),
            "chunk_index": match.get("metadata", {}).get("chunk_index")
        })

    return {
        "question": question,
        "answer": answer,
        "sources": unique_sources
    }