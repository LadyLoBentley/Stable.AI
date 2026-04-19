from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import date

class CareScheduleDetails(SQLModel):
    daysOfWeek: List[str] = Field(default_factory=list)
    daysOfMonth: List[int] = Field(default_factory=list)
    yearlyMonthDays: List[dict] = Field(default_factory=list)

class CareScheduleEntry(SQLModel):
    itemName: str
    dosageAmount: str
    dosageUnit: str
    administrationTimes: List[str] = Field(default_factory=list)
    frequencyType: str
    singleDoseDate: Optional[str] = None
    scheduleDetails: CareScheduleDetails
    notes: Optional[str] = None

class MedicalRecordRequest(SQLModel):
    horse_id: str
    vetClinic: str
    vetName: str
    vetPhone: str

    isSameVet: bool = True
    emergencyClinic: Optional[str] = None
    emergencyVetName: Optional[str] = None
    emergencyVetPhone: Optional[str] = None
    emergencyAuthorization: bool = False
    emergencyInstructions: Optional[str] = None

    rabiesExpiration: Optional[date] = None
    tetanusExpiration: Optional[date] = None
    westNileExpiration: Optional[date] = None
    eeeWeeExpiration: Optional[date] = None
    fluRhinoExpiration: Optional[date] = None
    cogginsExpiration: Optional[date] = None

    hasShoes: bool = False
    farrierName: Optional[str] = None
    farrierPhone: Optional[str] = None
    farrierDate: Optional[date] = None
    dentistName: Optional[str] = None
    dentistPhone: Optional[str] = None
    dentalDate: Optional[date] = None
    chiropractorName: Optional[str] = None
    chiropractorPhone: Optional[str] = None
    chiropractorDate: Optional[date] = None
    massageTherapist: Optional[str] = None
    therapistPhone: Optional[str] = None
    massageDate: Optional[date] = None
    lastDewormer: Optional[str] = None
    dewormProvider: Optional[str] = None
    dewormDate: Optional[date] = None

    medicalNotes: Optional[str] = None

    allergies: List[str] = Field(default_factory=list)
    medicalConditions: List[str] = Field(default_factory=list)
    medications: List[CareScheduleEntry] = Field(default_factory=list)
    supplements: List[CareScheduleEntry] = Field(default_factory=list)