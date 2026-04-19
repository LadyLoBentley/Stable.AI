import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import MedicationsSupplementsEditForm from "./MedicationsSupplementsEditForm.jsx";
import {
    formatAdministrationTimes,
    formatScheduleDetails,
    formatDosage
} from "./careScheduleUtils.js";

function MedicationsAndSupplementsTab() {
    const { horse } = useOutletContext();

    const [medications, setMedications] = useState([]);
    const [supplements, setSupplements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    async function fetchCareItems() {
        try {
            setLoading(true);
            setError("");

            const [medicationsResponse, supplementsResponse] = await Promise.all([
                fetch(`http://127.0.0.1:8002/api/medications/${horse.horse_id}`),
                fetch(`http://127.0.0.1:8002/api/supplements/${horse.horse_id}`)
            ]);

            let medicationsData = [];
            let supplementsData = [];

            if (medicationsResponse.ok) {
                medicationsData = await medicationsResponse.json();
            } else if (medicationsResponse.status !== 404) {
                throw new Error("Failed to load medications");
            }

            if (supplementsResponse.ok) {
                supplementsData = await supplementsResponse.json();
            } else if (supplementsResponse.status !== 404) {
                throw new Error("Failed to load supplements");
            }

            setMedications(medicationsData);
            setSupplements(supplementsData);
        } catch (fetchError) {
            setError(fetchError.message || "Failed to load medications and supplements");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (horse?.horse_id) {
            fetchCareItems();
        }
    }, [horse?.horse_id]);

    function handleSaved(updatedData) {
        setMedications(updatedData.medications || []);
        setSupplements(updatedData.supplements || []);
        setIsEditing(false);
    }

    if (loading) return <p>Loading medications and supplements...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="formInputs">
            <div className="formContainer">
                {isEditing ? (
                    <MedicationsSupplementsEditForm
                        horseId={horse.horse_id}
                        medications={medications}
                        supplements={supplements}
                        onSaved={handleSaved}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <div className="profileSectionActions">
                            <button
                                type="button"
                                className="profileActionButton"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Medications & Supplements
                            </button>
                        </div>

                        <div className="formSection">
                            <h3>Medications</h3>

                            {medications.length === 0 && (
                                <p>No medications are on file.</p>
                            )}

                            {medications.map((medication, index) => {
                                const administrationTimes = formatAdministrationTimes(medication.administration_times);
                                const scheduleDetails = formatScheduleDetails(
                                    medication.schedule_details,
                                    medication.frequency_type
                                );
                                const dosage = formatDosage(
                                    medication.dosage_amount,
                                    medication.dosage_unit
                                );

                                return (
                                    <div key={medication.horse_medication_id} className="recordCard">
                                        {index > 0 && <div className="sectionDivider"></div>}

                                        {medication.medication_name && (
                                            <p><b>Name:</b> {medication.medication_name}</p>
                                        )}

                                        {dosage && (
                                            <p><b>Dosage:</b> {dosage}</p>
                                        )}

                                        {medication.frequency_type && (
                                            <p><b>Frequency:</b> {medication.frequency_type}</p>
                                        )}

                                        {administrationTimes && (
                                            <p><b>Administration Times:</b> {administrationTimes}</p>
                                        )}

                                        {["Weekly", "Monthly", "Yearly"].includes(medication.frequency_type) &&
                                            scheduleDetails && (
                                                <p><b>Schedule Details:</b> {scheduleDetails}</p>
                                            )}

                                        {medication.frequency_type === "One-Time Dose" &&
                                            medication.single_dose_date && (
                                                <p><b>Single Dose Date:</b> {medication.single_dose_date}</p>
                                            )}

                                        {medication.notes && (
                                            <p><b>Notes:</b> {medication.notes}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="formSection">
                            <h3>Supplements</h3>

                            {supplements.length === 0 && (
                                <p>No supplements are on file.</p>
                            )}

                            {supplements.map((supplement, index) => {
                                const administrationTimes = formatAdministrationTimes(supplement.administration_times);
                                const scheduleDetails = formatScheduleDetails(
                                    supplement.schedule_details,
                                    supplement.frequency_type
                                );
                                const dosage = formatDosage(
                                    supplement.dosage_amount,
                                    supplement.dosage_unit
                                );

                                return (
                                    <div key={supplement.horse_supplements_id} className="recordCard">
                                        {index > 0 && <div className="sectionDivider"></div>}

                                        {supplement.supplement_name && (
                                            <p><b>Name:</b> {supplement.supplement_name}</p>
                                        )}

                                        {dosage && (
                                            <p><b>Dosage:</b> {dosage}</p>
                                        )}

                                        {supplement.frequency_type && (
                                            <p><b>Frequency:</b> {supplement.frequency_type}</p>
                                        )}

                                        {administrationTimes && (
                                            <p><b>Administration Times:</b> {administrationTimes}</p>
                                        )}

                                        {["Weekly", "Monthly", "Yearly"].includes(supplement.frequency_type) &&
                                            scheduleDetails && (
                                                <p><b>Schedule Details:</b> {scheduleDetails}</p>
                                            )}

                                        {supplement.frequency_type === "One-Time Dose" &&
                                            supplement.single_dose_date && (
                                                <p><b>Single Dose Date:</b> {supplement.single_dose_date}</p>
                                            )}

                                        {supplement.notes && (
                                            <p><b>Notes:</b> {supplement.notes}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {medications.length === 0 && supplements.length === 0 && (
                            <div className="formSection">
                                <h3>Care Summary</h3>
                                <p>No medications or supplements are currently on file for this horse.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default MedicationsAndSupplementsTab;
