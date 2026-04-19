import { useEffect, useState } from "react";

import CareScheduleField from "../../components/Form/CareScheduleField.jsx";
import Button from "../../components/Button/Button.jsx";

import { mapCareResponseToEntry, sanitizeCareEntries } from "./careScheduleUtils.js";
import { readErrorMessage } from "./profileFormUtils.js";

function MedicationsSupplementsEditForm({
    horseId,
    medications,
    supplements,
    onSaved,
    onCancel
}) {
    const [medicationEntries, setMedicationEntries] = useState([]);
    const [supplementEntries, setSupplementEntries] = useState([]);
    const [medicationOptions, setMedicationOptions] = useState([]);
    const [supplementOptions, setSupplementOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    useEffect(() => {
        setMedicationEntries(
            Array.isArray(medications)
                ? medications.map((item) =>
                    mapCareResponseToEntry(item, "medication_name", "horse_medication_id")
                )
                : []
        );
        setSupplementEntries(
            Array.isArray(supplements)
                ? supplements.map((item) =>
                    mapCareResponseToEntry(item, "supplement_name", "horse_supplements_id")
                )
                : []
        );
        setSubmitStatus({ type: "", message: "" });
    }, [medications, supplements]);

    useEffect(() => {
        async function fetchInventoryOptions() {
            try {
                setLoadingOptions(true);
                const response = await fetch("http://127.0.0.1:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error("Failed to load medication and supplement options.");
                }

                const data = await response.json();
                const inventory = Array.isArray(data) ? data : [];

                setMedicationOptions(
                    inventory.filter((item) => item.category === "Medication").map((item) => item.label)
                );
                setSupplementOptions(
                    inventory.filter((item) => item.category === "Supplements").map((item) => item.label)
                );
            } catch (error) {
                setSubmitStatus({
                    type: "error",
                    message: error.message || "Failed to load care schedule options."
                });
            } finally {
                setLoadingOptions(false);
            }
        }

        fetchInventoryOptions();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitStatus({ type: "", message: "" });

        try {
            const [medicationsResponse, supplementsResponse] = await Promise.all([
                fetch(`http://127.0.0.1:8002/api/medications/${horseId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sanitizeCareEntries(medicationEntries))
                }),
                fetch(`http://127.0.0.1:8002/api/supplements/${horseId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sanitizeCareEntries(supplementEntries))
                })
            ]);

            if (!medicationsResponse.ok) {
                throw new Error(await readErrorMessage(medicationsResponse, "Failed to update medications."));
            }

            if (!supplementsResponse.ok) {
                throw new Error(await readErrorMessage(supplementsResponse, "Failed to update supplements."));
            }

            const [medicationsData, supplementsData] = await Promise.all([
                medicationsResponse.json(),
                supplementsResponse.json()
            ]);

            onSaved({
                medications: medicationsData,
                supplements: supplementsData
            });
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to update medications and supplements."
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {submitStatus.message && (
                <div className={submitStatus.type === "error" ? "formAlert error" : "formAlert success"}>
                    {submitStatus.message}
                </div>
            )}

            {loadingOptions && <div className="formAlert">Loading care schedule options...</div>}

            <div className="formInputs">
                <div className="formSection">
                    <CareScheduleField
                        label="Medications"
                        value={medicationEntries}
                        onChange={setMedicationEntries}
                        itemOptions={medicationOptions}
                        itemTipTitle="Medications"
                        itemTipBody="Add the medications currently assigned to this horse."
                        tipDosageTitle="Dosage"
                        tipDosageBody="Enter the amount given per administration."
                        tipFrequencyTitle="Frequency"
                        tipFrequencyBody="Choose how often the medication is given."
                        tipNotesTitle="Medication Notes"
                        tipNotesBody="Include administration instructions or monitoring notes."
                    />
                </div>

                <div className="formSection">
                    <CareScheduleField
                        label="Supplements"
                        value={supplementEntries}
                        onChange={setSupplementEntries}
                        itemOptions={supplementOptions}
                        itemTipTitle="Supplements"
                        itemTipBody="Add the supplements currently assigned to this horse."
                        tipDosageTitle="Dosage"
                        tipDosageBody="Enter the amount given per administration."
                        tipFrequencyTitle="Frequency"
                        tipFrequencyBody="Choose how often the supplement is given."
                        tipNotesTitle="Supplement Notes"
                        tipNotesBody="Include mixing, feeding, or observation notes."
                    />
                </div>

                <div className="formButton">
                    <Button label="Cancel" variant="secondary" type="button" onClick={onCancel} />
                    <Button label="Save Medications & Supplements" type="submit" />
                </div>
            </div>
        </form>
    );
}

export default MedicationsSupplementsEditForm;
