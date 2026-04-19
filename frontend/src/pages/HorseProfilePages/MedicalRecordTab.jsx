import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import FormatDate from "../../utils/FormatDate";
import MedicalRecordEditForm from "./MedicalRecordEditForm.jsx";

function getVaccineStatus(date) {
    if (!date) {
        return {
            text: "Missing",
            className: "statusMissing"
        };
    }

    const today = new Date();
    const recordDate = new Date(date);

    if (recordDate < today) {
        return {
            text: "Expired",
            className: "statusExpired"
        };
    }

    return {
        text: "Current",
        className: "statusCurrent"
    };
}

function VaccineRow({ label, date }) {
    const status = getVaccineStatus(date);

    return (
        <div className="recordRow">
            <div className="recordLabel">{label}</div>
            <div className="recordDate">
                {date ? FormatDate(date) : "Not on file"}
            </div>
            <div className="recordStatus">
                <span className={status.className}>{status.text}</span>
            </div>
        </div>
    );
}

function getNextFarrierDate(date) {
    if (!date) return null;

    const next = new Date(date);
    next.setDate(next.getDate() + 42);

    return next;
}

function getFarrierStatus(dueDate) {
    if (!dueDate) {
        return {
            text: "Not recorded",
            className: "statusMissing"
        };
    }

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due < today) {
        return {
            text: "Overdue",
            className: "statusExpired"
        };
    }

    return {
        text: "Current",
        className: "statusCurrent"
    };
}

function MedicalRecordTab() {
    const { horse, setHeaderAction } = useOutletContext();
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dewormerName, setDewormerName] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    async function fetchMedicalRecord() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://127.0.0.1:8002/api/medical_records/horses/${horse.horse_id}`
            );

            if (!response.ok) {
                throw new Error("Failed to load medical record");
            }

            const data = await response.json();
            setMedicalRecord(data);

            if (data.item_id) {
                const dewormerResponse = await fetch(
                    `http://127.0.0.1:8002/api/inventory/${data.item_id}`
                );

                if (dewormerResponse.ok) {
                    const dewormerData = await dewormerResponse.json();
                    setDewormerName(dewormerData.label || "");
                } else {
                    setDewormerName("");
                }
            } else {
                setDewormerName("");
            }
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMedicalRecord();
    }, [horse.horse_id]);

    useEffect(() => {
        if (loading || error || !medicalRecord || isEditing) {
            setHeaderAction(null);
            return;
        }

        setHeaderAction([
            {
                key: "medical-history",
                label: "View Medical History",
                to: `/horses/${horse.horse_id}/medical/history`,
                variant: "secondary"
            },
            {
                key: "edit-medical-record",
                label: "Edit Medical Record",
                onClick: () => setIsEditing(true)
            }
        ]);

        return () => setHeaderAction(null);
    }, [error, horse.horse_id, isEditing, loading, medicalRecord, setHeaderAction]);

    function handleSaved(updatedRecord, updatedDewormerName) {
        setMedicalRecord(updatedRecord);
        setDewormerName(updatedDewormerName || "");
        setIsEditing(false);
    }

    if (loading) return <p className="pageMessage">Loading medical record...</p>;
    if (error) return <p className="pageMessage errorMessage">{error}</p>;
    if (!medicalRecord) return <p className="pageMessage">No Medical Record Found.</p>;

    const nextFarrierDate = getNextFarrierDate(medicalRecord.farrier_date);
    const farrierStatus = getFarrierStatus(nextFarrierDate);
    const hasHealthConditions = medicalRecord.medical_conditions?.length > 0;
    const hasAllergies = medicalRecord.allergies?.length > 0;

    if (isEditing) {
        return (
            <MedicalRecordEditForm
                horseId={horse.horse_id}
                medicalRecord={medicalRecord}
                currentDewormerName={dewormerName}
                onSaved={handleSaved}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <>
            <div className="formSection">
                <h3>Primary Vet</h3>
                <dl className="detailList">
                    <div className={`detailRow ${medicalRecord.vet_clinic ? "" : "empty"}`}>
                        <dt>Vet Clinic</dt>
                        <dd>{medicalRecord.vet_clinic || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${medicalRecord.vet_name ? "" : "empty"}`}>
                        <dt>Veterinarian</dt>
                        <dd>{medicalRecord.vet_name || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${medicalRecord.vet_phone ? "" : "empty"}`}>
                        <dt>Phone Number</dt>
                        <dd>{medicalRecord.vet_phone || "Not on file"}</dd>
                    </div>
                </dl>
            </div>

            <div className="formSection">
                <h3>Emergency Information</h3>
                {medicalRecord.is_same_vet ? (
                    <div className="safetyChipGroup">
                        <span className="safetyChip calm">
                            <span className="material-symbols-rounded">verified</span>
                            Primary veterinarian also handles emergencies
                        </span>
                    </div>
                ) : (
                    <dl className="detailList">
                        <div className={`detailRow ${medicalRecord.emergency_clinic ? "" : "empty"}`}>
                            <dt>Emergency Clinic</dt>
                            <dd>{medicalRecord.emergency_clinic || "Not on file"}</dd>
                        </div>
                        <div className={`detailRow ${medicalRecord.emergency_vet_name ? "" : "empty"}`}>
                            <dt>Veterinarian</dt>
                            <dd>{medicalRecord.emergency_vet_name || "Not on file"}</dd>
                        </div>
                        <div className={`detailRow ${medicalRecord.emergency_vet_phone ? "" : "empty"}`}>
                            <dt>Phone Number</dt>
                            <dd>{medicalRecord.emergency_vet_phone || "Not on file"}</dd>
                        </div>
                    </dl>
                )}

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded">gavel</span>
                    Emergency Treatment Authorization
                </h4>
                <div className="safetyChipGroup">
                    <span className={`safetyChip ${medicalRecord.emergency_authorization ? "calm" : "warn"}`}>
                        <span className="material-symbols-rounded">
                            {medicalRecord.emergency_authorization ? "check_circle" : "cancel"}
                        </span>
                        {medicalRecord.emergency_authorization ? "Authorized" : "Not Authorized"}
                    </span>
                </div>

                {medicalRecord.emergency_instructions && (
                    <>
                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded">description</span>
                            Emergency Instructions
                        </h4>
                        <p className="instructionsText">{medicalRecord.emergency_instructions}</p>
                    </>
                )}
            </div>

            <div className="formSection">
                <h3>Health Records</h3>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded">vaccines</span>
                    Vaccination & Health Records
                </h4>
                <div className="recordsTable">
                    <div className="recordHeader">
                        <div>Vaccine</div>
                        <div>Expiration</div>
                        <div>Status</div>
                    </div>
                    <VaccineRow label="Rabies" date={medicalRecord.rabies_expiration} />
                    <VaccineRow label="Tetanus" date={medicalRecord.tetanus_expiration} />
                    <VaccineRow label="West Nile" date={medicalRecord.west_nile_expiration} />
                    <VaccineRow label="EEE/WEE" date={medicalRecord.eee_wee_expiration} />
                    <VaccineRow label="Flu/Rhino" date={medicalRecord.flu_rhino_expiration} />
                    <VaccineRow label="Coggins" date={medicalRecord.coggins_expiration} />
                </div>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded">science</span>
                    Deworm Record
                </h4>
                <dl className="detailList">
                    <div className={`detailRow ${dewormerName ? "" : "empty"}`}>
                        <dt>Product</dt>
                        <dd>{dewormerName || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${medicalRecord.deworm_provider ? "" : "empty"}`}>
                        <dt>Provider</dt>
                        <dd>{medicalRecord.deworm_provider || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${medicalRecord.deworm_date ? "" : "empty"}`}>
                        <dt>Date Given</dt>
                        <dd>{medicalRecord.deworm_date ? FormatDate(medicalRecord.deworm_date) : "Not recorded"}</dd>
                    </div>
                </dl>
            </div>

            {(hasHealthConditions || hasAllergies) && (
                <div className="formSection">
                    <h3>Health Conditions & Allergies</h3>

                    {hasHealthConditions && (
                        <>
                            <h4 className="subSectionHeader">
                                <span className="material-symbols-rounded">medical_information</span>
                                Health Conditions
                            </h4>
                            <div className="tagGroup">
                                {medicalRecord.medical_conditions.map((condition) => (
                                    <span key={condition} className="recordTag">
                                        {condition}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}

                    {hasAllergies && (
                        <>
                            <h4 className="subSectionHeader">
                                <span className="material-symbols-rounded">coronavirus</span>
                                Allergies
                            </h4>
                            <div className="tagGroup">
                                {medicalRecord.allergies.map((allergy) => (
                                    <span key={allergy} className="allergyTag">
                                        {allergy}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="formSection">
                <h3>Preventative Care</h3>

                            <h4 className="subSectionHeader">
                                <span className="material-symbols-rounded">construction</span>
                                Farrier Care
                            </h4>
                            <dl className="detailList">
                                <div className="detailRow">
                                    <dt>Shoeing Status</dt>
                                    <dd>
                                        <span className={medicalRecord.has_shoes ? "statusCurrent" : "statusMissing"}>
                                            {medicalRecord.has_shoes ? "Shod" : "Barefoot"}
                                        </span>
                                    </dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.farrier_date ? "" : "empty"}`}>
                                    <dt>Last Farrier Visit</dt>
                                    <dd>{medicalRecord.farrier_date ? FormatDate(medicalRecord.farrier_date) : "Not recorded"}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Next Visit Status</dt>
                                    <dd>
                                        <span className={farrierStatus.className}>
                                            {nextFarrierDate ? `Due ${FormatDate(nextFarrierDate)}` : farrierStatus.text}
                                        </span>
                                    </dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.farrier_name ? "" : "empty"}`}>
                                    <dt>Farrier Name</dt>
                                    <dd>{medicalRecord.farrier_name || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.farrier_phone ? "" : "empty"}`}>
                                    <dt>Farrier Phone</dt>
                                    <dd>{medicalRecord.farrier_phone || "—"}</dd>
                                </div>
                            </dl>

                            <h4 className="subSectionHeader">
                                <span className="material-symbols-rounded">dentistry</span>
                                Dental Care
                            </h4>
                            <dl className="detailList">
                                <div className={`detailRow ${medicalRecord.dentist_name ? "" : "empty"}`}>
                                    <dt>Name</dt>
                                    <dd>{medicalRecord.dentist_name || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.dentist_phone ? "" : "empty"}`}>
                                    <dt>Phone Number</dt>
                                    <dd>{medicalRecord.dentist_phone || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.dental_date ? "" : "empty"}`}>
                                    <dt>Last Visit</dt>
                                    <dd>{medicalRecord.dental_date ? FormatDate(medicalRecord.dental_date) : "Not recorded"}</dd>
                                </div>
                            </dl>

                            <h4 className="subSectionHeader">
                                <span className="material-symbols-rounded">accessibility_new</span>
                                Chiropractor Care
                            </h4>
                            <dl className="detailList">
                                <div className={`detailRow ${medicalRecord.chiropractor_name ? "" : "empty"}`}>
                                    <dt>Name</dt>
                                    <dd>{medicalRecord.chiropractor_name || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.chiropractor_phone ? "" : "empty"}`}>
                                    <dt>Phone Number</dt>
                                    <dd>{medicalRecord.chiropractor_phone || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.chiropractor_date ? "" : "empty"}`}>
                                    <dt>Last Visit</dt>
                                    <dd>{medicalRecord.chiropractor_date ? FormatDate(medicalRecord.chiropractor_date) : "Not recorded"}</dd>
                                </div>
                            </dl>

                            <h4 className="subSectionHeader">
                                <span className="material-symbols-rounded">spa</span>
                                Massage Therapy
                            </h4>
                            <dl className="detailList">
                                <div className={`detailRow ${medicalRecord.massage_therapist ? "" : "empty"}`}>
                                    <dt>Name</dt>
                                    <dd>{medicalRecord.massage_therapist || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.therapist_phone ? "" : "empty"}`}>
                                    <dt>Phone Number</dt>
                                    <dd>{medicalRecord.therapist_phone || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${medicalRecord.massage_date ? "" : "empty"}`}>
                                    <dt>Last Visit</dt>
                                    <dd>{medicalRecord.massage_date ? FormatDate(medicalRecord.massage_date) : "Not recorded"}</dd>
                                </div>
                            </dl>
            </div>

            {medicalRecord.medical_notes && (
                <div className="formSection">
                    <h3>Medical Notes</h3>
                    <p className="instructionsText">{medicalRecord.medical_notes}</p>
                </div>
            )}
        </>
    );
}

export default MedicalRecordTab;
