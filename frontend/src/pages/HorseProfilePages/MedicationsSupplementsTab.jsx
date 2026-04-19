import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import MedicationsSupplementsEditForm from "./MedicationsSupplementsEditForm.jsx";
import {
    formatAdministrationTimes,
    formatScheduleDetails,
    formatDosage
} from "./careScheduleUtils.js";

function MedicationsAndSupplementsTab() {
    const { horse, setHeaderAction } = useOutletContext();

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

    useEffect(() => {
        if (loading || error || isEditing) {
            setHeaderAction(null);
            return;
        }

        setHeaderAction({
            label: "Edit Medications & Supplements",
            onClick: () => setIsEditing(true)
        });

        return () => setHeaderAction(null);
    }, [error, isEditing, loading, setHeaderAction]);

    function handleSaved(updatedData) {
        setMedications(updatedData.medications || []);
        setSupplements(updatedData.supplements || []);
        setIsEditing(false);
    }

    if (loading) return <p className="pageMessage">Loading medications and supplements...</p>;
    if (error) return <p className="pageMessage errorMessage">{error}</p>;

    if (isEditing) {
        return (
            <MedicationsSupplementsEditForm
                horseId={horse.horse_id}
                medications={medications}
                supplements={supplements}
                onSaved={handleSaved}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <>
            <div className="formSection">
                <h3>Medications</h3>

                {medications.length === 0 && (
                    <div className="emptyState">No medications are on file.</div>
                )}

                {medications.map((medication) => {
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
                            <div className="recordCardHeader">
                                <h4 className="recordCardTitle">
                                    {medication.medication_name || "Untitled Medication"}
                                </h4>
                                {medication.frequency_type && (
                                    <span className="recordCardSubtitle">
                                        {medication.frequency_type}
                                    </span>
                                )}
                            </div>

                            <dl className="detailList">
                                {dosage && (
                                    <div className="detailRow">
                                        <dt>Dosage</dt>
                                        <dd>{dosage}</dd>
                                    </div>
                                )}
                                {administrationTimes && (
                                    <div className="detailRow">
                                        <dt>Administration Times</dt>
                                        <dd>{administrationTimes}</dd>
                                    </div>
                                )}
                                {["Weekly", "Monthly", "Yearly"].includes(medication.frequency_type) &&
                                    scheduleDetails && (
                                        <div className="detailRow wide">
                                            <dt>Schedule Details</dt>
                                            <dd>{scheduleDetails}</dd>
                                        </div>
                                    )}
                                {medication.frequency_type === "One-Time Dose" &&
                                    medication.single_dose_date && (
                                        <div className="detailRow">
                                            <dt>Single Dose Date</dt>
                                            <dd>{medication.single_dose_date}</dd>
                                        </div>
                                    )}
                            </dl>

                            {medication.notes && (
                                <p className="recordCardNote">
                                    <strong>Notes:</strong> {medication.notes}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="formSection">
                <h3>Supplements</h3>

                {supplements.length === 0 && (
                    <div className="emptyState">No supplements are on file.</div>
                )}

                {supplements.map((supplement) => {
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
                            <div className="recordCardHeader">
                                <h4 className="recordCardTitle">
                                    {supplement.supplement_name || "Untitled Supplement"}
                                </h4>
                                {supplement.frequency_type && (
                                    <span className="recordCardSubtitle">
                                        {supplement.frequency_type}
                                    </span>
                                )}
                            </div>

                            <dl className="detailList">
                                {dosage && (
                                    <div className="detailRow">
                                        <dt>Dosage</dt>
                                        <dd>{dosage}</dd>
                                    </div>
                                )}
                                {administrationTimes && (
                                    <div className="detailRow">
                                        <dt>Administration Times</dt>
                                        <dd>{administrationTimes}</dd>
                                    </div>
                                )}
                                {["Weekly", "Monthly", "Yearly"].includes(supplement.frequency_type) &&
                                    scheduleDetails && (
                                        <div className="detailRow wide">
                                            <dt>Schedule Details</dt>
                                            <dd>{scheduleDetails}</dd>
                                        </div>
                                    )}
                                {supplement.frequency_type === "One-Time Dose" &&
                                    supplement.single_dose_date && (
                                        <div className="detailRow">
                                            <dt>Single Dose Date</dt>
                                            <dd>{supplement.single_dose_date}</dd>
                                        </div>
                                    )}
                            </dl>

                            {supplement.notes && (
                                <p className="recordCardNote">
                                    <strong>Notes:</strong> {supplement.notes}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {medications.length === 0 && supplements.length === 0 && (
                <div className="formSection">
                    <h3>Care Summary</h3>
                    <div className="emptyState">
                        No medications or supplements are currently on file for this horse.
                    </div>
                </div>
            )}
        </>
    );
}

export default MedicationsAndSupplementsTab;
