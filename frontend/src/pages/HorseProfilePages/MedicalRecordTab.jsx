import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormatDate from "../../utils/FormatDate";

function MedicalRecordTab() {
    const { horse } = useOutletContext();
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const[dewormer, setDewormer] = useState(null);

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

    function VaccineRow({label, date, getVaccineStatus}) {
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
        next.setDate(next.getDate() + 42); // 6 weeks

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

    useEffect(() => {
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
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMedicalRecord();
    }, [horse.horse_id]);

    useEffect(() => {
    if (!medicalRecord?.item_id) return;

    async function fetchDewormer() {
        try {
            const response = await fetch(
                `http://127.0.0.1:8002/api/inventory/${medicalRecord.item_id}`
            );

            if (!response.ok) {
                throw new Error("Failed to load dewormer");
            }

            const data = await response.json();
            setDewormer(data);

        } catch(err) {
            console.log(err.message);
        }
    }

    fetchDewormer();

}, [medicalRecord]);

    if (loading) return <p>Loading medical record...</p>;
    if (error) return <p>{error}</p>;
    if (!medicalRecord) return <p>No Medical Record Found.</p>;

    const nextFarrierDate = getNextFarrierDate(medicalRecord.farrier_date);
    const farrierStatus = getFarrierStatus(nextFarrierDate);
    const hasHealthConditions = medicalRecord.medical_conditions?.length > 0;
    const hasAllergies = medicalRecord.allergies?.length > 0;

    return (
        <div className="formInputs">
            <div className="formContainer">

                <div className="formSection">
                    <h3>Primary Vet</h3>
                    <p><b>Vet Clinic:</b> {medicalRecord.vet_clinic}</p>
                    <p><b>Veterinarian:</b> {medicalRecord.vet_name}</p>
                    <p><b>Phone Number:</b> {medicalRecord.vet_phone}</p>
                </div>

                <div className="formSection">
                    <h3>Emergency Information</h3>
                    {!medicalRecord.is_same_vet && (
                        <>
                            <p>{medicalRecord.vet_name} is responsible for emergency services. Please call {medicalRecord.vet_phone} immediately if there is an emergency.</p>
                        </>
                    )}

                    {medicalRecord.is_same_vet && (
                        <>
                            <p><b>Emergency Clinic:</b> {medicalRecord.emergency_clinic}</p>
                            <p><b>Veterinarian:</b> {medicalRecord.emergency_vet_name}</p>
                            <p><b>Phone Number:</b> {medicalRecord.emergency_vet_phone}</p>
                        </>
                    )}

                    <div className="sectionDivider"></div>

                    {medicalRecord.emergency_authorization && (
                        <>
                            <p><b>Emergency Treatment Authorization</b></p>
                            <p><b>Status:</b> <span className="authorized">Authorized</span></p>
                            <p>If the owner or emergency contact cannot be reached, the barn and veterinarian are authorized to provide necessary emergency treatment. Owner agrees to be financially responsible for services provided.</p>
                        </>
                    )}

                    {!medicalRecord.emergency_authorization && (
                        <>
                            <p><b>Emergency Treatment Authorization</b></p>
                            <p><b>Status:</b> <span className="notAuthorized">Not Authorized</span></p>
                            <p>Emergency treatment is not authorized without owner approval. Only stabilization care may be provided until contact is made.</p>
                        </>
                    )}

                    {medicalRecord.emergency_instructions && (
                        <>
                            <div className="sectionDivider"/>
                            <p><b>Emergency Instructions</b></p>
                            <p>{medicalRecord.emergency_instructions}</p>
                        </>
                    )}
                </div>

                <div className="formSection">
                    <h3>Health Records</h3>

                    <p><b>Vaccination & Health Records</b></p>
                    <div className="recordsTable">
                        <VaccineRow
                            label="Rabies Expiration Date"
                            date={medicalRecord.rabies_expiration}
                            getVaccineStatus={getVaccineStatus}
                        />

                        <VaccineRow
                            label="Tetanus Expiration Date"
                            date={medicalRecord.tetanus_expiration}
                            getVaccineStatus={getVaccineStatus}
                        />

                        <VaccineRow
                            label="West Nile Expiration Date"
                            date={medicalRecord.west_nile_expiration}
                            getVaccineStatus={getVaccineStatus}
                        />

                        <VaccineRow
                            label="EEE/WEE Expiration Date"
                            date={medicalRecord.eee_wee_expiration}
                            getVaccineStatus={getVaccineStatus}
                        />

                        <VaccineRow
                            label="Flu/Rhino Expiration Date"
                            date={medicalRecord.flu_rhino_expiration}
                            getVaccineStatus={getVaccineStatus}
                        />

                        <VaccineRow
                            label="Coggins Expiration Date"
                            date={medicalRecord.coggins_expiration}
                            getVaccineStatus={getVaccineStatus}
                        />
                    </div>

                    {dewormer && (
                        <>
                        <p><b>Deworm Record</b></p>
                        <div className="recordsTable">
                            <div className="recordRow">
                                <div className="recordLabel">Product</div>
                                <div className="recordLabel">Provider</div>
                                <div className="recordLabel">Date Given</div>
                            </div>

                            <div className="recordRow">
                                <div className="recordDate">
                                    {dewormer.label || "Not on file"}
                                </div>

                                <div className="recordStatus">
                                    {medicalRecord.deworm_provider || "Not on file"}
                                </div>

                                <div className="recordDate">
                                    {medicalRecord.deworm_date
                                        ? FormatDate(medicalRecord.deworm_date)
                                        : "Not recorded"}
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                </div>

                {(hasHealthConditions || hasAllergies) && (
                    <div className="formSection">
                        <h3>Health Conditions & Allergies</h3>

                        {hasHealthConditions && (
                            <div className="recordGroup">
                                <p><b>Health Conditions</b></p>
                                <div className="tagGroup">
                                    {medicalRecord.medical_conditions.map((condition) => (
                                        <span key={condition} className="recordTag">
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasAllergies && (
                            <div className="recordGroup">
                                <p><b>Allergies</b></p>
                                <div className="tagGroup">
                                    {medicalRecord.allergies.map((allergy) => (
                                        <span key={allergy} className="allergyTag">
                                            {allergy}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="formSection">
                    <h3>Preventative Care</h3>

                    <p><b>Farrier Care Record</b></p>
                    <div className="recordsTable">
                        <div className="recordRow">
                            <div className="recordLabel">Shoeing Status</div>


                            <div className="recordStatus">
                                <span className={medicalRecord.has_shoes ? "statusCurrent" : "statusMissing"}>
                                    {medicalRecord.has_shoes ? "Shod" : "Barefoot"}
                                </span>
                            </div>
                        </div>

                        <div className="recordRow">
                            <div className="recordLabel">Last Farrier Visit</div>

                            <div className="recordDate">
                                {medicalRecord.farrier_date
                                    ? FormatDate(medicalRecord.farrier_date)
                                    : "Not recorded"}
                            </div>

                            <div className="recordStatus">
                               <span className={farrierStatus.className}>
                                    {nextFarrierDate
                                        ? `Due ${FormatDate(nextFarrierDate)}`
                                        : farrierStatus.text}
                                </span>
                            </div>
                        </div>

                        <div className="recordRow">
                            <div className="recordLabel">Farrier</div>

                            <div className="recordDate">
                                {medicalRecord.farrier_name || "Not on file"}
                            </div>

                            <div className="recordStatus">
                                {medicalRecord.farrier_phone || "—"}
                            </div>
                        </div>
                    </div>

                    <p><b>Dental Care Record</b></p>
                    <div className="recordsTable">

                        <div className="recordRow">
                            <div className="recordLabel">Name</div>
                            <div className="recordLabel">Phone Number</div>
                            <div className="recordLabel">Last Visit</div>
                        </div>

                        <div className="recordRow">
                            <div className="recordDate">
                                {medicalRecord.dentist_name || "Not on file"}
                            </div>

                            <div className="recordStatus">
                                {medicalRecord.dentist_phone || "Not on file"}
                            </div>

                            <div className="recordDate">
                                {medicalRecord.dental_date
                                    ? FormatDate(medicalRecord.dental_date)
                                    : "Not recorded"}
                            </div>
                        </div>
                    </div>

                    <p><b>Chiropractor Care Record</b></p>
                    <div className="recordsTable">
                        <div className="recordRow">
                            <div className="recordLabel">Name</div>
                            <div className="recordLabel">Phone Number</div>
                            <div className="recordLabel">Last Visit</div>
                        </div>

                        <div className="recordRow">
                            <div className="recordDate">
                                {medicalRecord.chiropractor_name || "Not on file"}
                            </div>

                            <div className="recordStatus">
                                {medicalRecord.chiropractor_phone || "Not on file"}
                            </div>

                            <div className="recordDate">
                                {medicalRecord.chiropractor_date
                                    ? FormatDate(medicalRecord.chiropractor_date)
                                    : "Not recorded"}
                            </div>
                        </div>
                    </div>

                    <p><b>Massage Therapy Record</b></p>
                    <div className="recordsTable">
                        <div className="recordRow">
                            <div className="recordLabel">Name</div>
                            <div className="recordLabel">Phone Number</div>
                            <div className="recordLabel">Last Visit</div>
                        </div>

                        <div className="recordRow">
                            <div className="recordDate">
                                {medicalRecord.massage_therapist || "Not on file"}
                            </div>

                            <div className="recordStatus">
                                {medicalRecord.therapist_phone || "Not on file"}
                            </div>

                            <div className="recordDate">
                                {medicalRecord.massage_date
                                    ? FormatDate(medicalRecord.massage_date)
                                    : "Not recorded"}
                            </div>
                        </div>
                    </div>
                </div>

                {medicalRecord.medical_notes && (
                    <div className="formSection">
                        <h3>Additional Information</h3>
                        <p className="Additional Information">{medicalRecord.medical_notes}</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default MedicalRecordTab;