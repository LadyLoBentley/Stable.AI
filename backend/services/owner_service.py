from sqlmodel import Session
from models.owner import OwnerInfo
from schemas.owner_request import OwnerRequest

def add_owner(
        session: Session,
        submission: OwnerRequest
) -> OwnerInfo:

    owner = OwnerInfo(
        owner_name=submission.ownerName,
        owner_phone=submission.ownerPhone,
        owner_email=submission.ownerEmail,

        emergency_contact_name=submission.emergencyContactName,
        emergency_contact_relation=submission.emergencyContactRelations,
        emergency_contact_phone=submission.emergencyContactPhone,

        street_address=submission.streetAddress,
        apt_no=submission.aptNo,
        city=submission.city,
        state=submission.state,
        zip=submission.zip,

        signed_waiver=submission.signedWaiver,

    )

    session.add(owner)
    session.commit()
    session.refresh(owner)

    return owner