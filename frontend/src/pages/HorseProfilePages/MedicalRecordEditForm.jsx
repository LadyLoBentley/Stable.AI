import { useEffect, useState } from "react";

import TextField from "../../components/Form/TextField.jsx";
import TagSearchField from "../../components/Form/TagSearchField.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import CheckboxField from "../../components/Form/Checkbox.jsx";
import DropdownField from "../../components/Form/DropdownField.jsx";

import { mapCareResponseToEntry, sanitizeCareEntries } from "./careScheduleUtils.js";
import { readErrorMessage, toDateInputValue } from "./profileFormUtils.js";

function buildInitialState(medicalRecord, currentDewormerName) {
    return {
        vetClinic: medicalRecord?.vet_clinic || "",
        vetName: medicalRecord?.vet_name || "",
        vetPhone: medicalRecord?.vet_phone || "",

        isSameVet: medicalRecord?.is_same_vet ?? true,
        emergencyClinic: medicalRecord?.emergency_clinic || "",
        emergencyVetName: medicalRecord?.emergency_vet_name || "",
        emergencyVetPhone: medicalRecord?.emergency_vet_phone || "",
        emergencyAuthorization: Boolean(medicalRecord?.emergency_authorization),
        emergencyInstructions: medicalRecord?.emergency_instructions || "",

        rabiesExpiration: toDateInputValue(medicalRecord?.rabies_expiration),
        tetanusExpiration: toDateInputValue(medicalRecord?.tetanus_expiration),
        westNileExpiration: toDateInputValue(medicalRecord?.west_nile_expiration),
        eeeWeeExpiration: toDateInputValue(medicalRecord?.eee_wee_expiration),
        fluRhinoExpiration: toDateInputValue(medicalRecord?.flu_rhino_expiration),
        cogginsExpiration: toDateInputValue(medicalRecord?.coggins_expiration),

        hasShoes: Boolean(medicalRecord?.has_shoes),
        farrierName: medicalRecord?.farrier_name || "",
        farrierPhone: medicalRecord?.farrier_phone || "",
        farrierDate: toDateInputValue(medicalRecord?.farrier_date),
        dentistName: medicalRecord?.dentist_name || "",
        dentistPhone: medicalRecord?.dentist_phone || "",
        dentalDate: toDateInputValue(medicalRecord?.dental_date),
        chiropractorName: medicalRecord?.chiropractor_name || "",
        chiropractorPhone: medicalRecord?.chiropractor_phone || "",
        chiropractorDate: toDateInputValue(medicalRecord?.chiropractor_date),
        massageTherapist: medicalRecord?.massage_therapist || "",
        therapistPhone: medicalRecord?.therapist_phone || "",
        massageDate: toDateInputValue(medicalRecord?.massage_date),
        lastDewormer: currentDewormerName || "",
        dewormProvider: medicalRecord?.deworm_provider || "",
        dewormDate: toDateInputValue(medicalRecord?.deworm_date),

        medicalConditions: Array.isArray(medicalRecord?.medical_conditions) ? medicalRecord.medical_conditions : [],
        allergies: Array.isArray(medicalRecord?.allergies) ? medicalRecord.allergies : [],
        medicalNotes: medicalRecord?.medical_notes || ""
    };
}

function MedicalRecordEditForm({
    horseId,
    medicalRecord,
    currentDewormerName,
    onSaved,
    onCancel
}) {
    const [formData, setFormData] = useState(() => buildInitialState(medicalRecord, currentDewormerName));
    const [healthConditions, setHealthConditions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [dewormers, setDewormers] = useState([]);
    const [preservedMedications, setPreservedMedications] = useState([]);
    const [preservedSupplements, setPreservedSupplements] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    useEffect(() => {
        setFormData(buildInitialState(medicalRecord, currentDewormerName));
        setErrors({});
        setSubmitStatus({ type: "", message: "" });
    }, [medicalRecord, currentDewormerName]);

    useEffect(() => {
        async function fetchOptions() {
            try {
                setLoadingOptions(true);

                const [
                    healthResponse,
                    allergyResponse,
                    inventoryResponse,
                    medicationsResponse,
                    supplementsResponse
                ] = await Promise.all([
                    fetch("http://127.0.0.1:8002/api/health/"),
                    fetch("http://127.0.0.1:8002/api/allergies/"),
                    fetch("http://127.0.0.1:8002/api/inventory/"),
                    fetch(`http://127.0.0.1:8002/api/medications/${horseId}`),
                    fetch(`http://127.0.0.1:8002/api/supplements/${horseId}`)
                ]);

                const [healthData, allergyData, inventoryData] = await Promise.all([
                    healthResponse.json(),
                    allergyResponse.json(),
                    inventoryResponse.json()
                ]);

                let medicationData = [];
                let supplementData = [];

                if (medicationsResponse.ok) {
                    medicationData = await medicationsResponse.json();
                }

                if (supplementsResponse.ok) {
                    supplementData = await supplementsResponse.json();
                }

                setHealthConditions(Array.isArray(healthData) ? healthData.map((item) => item.name) : []);
                setAllergies(Array.isArray(allergyData) ? allergyData.map((item) => item.name) : []);
                setDewormers(
                    Array.isArray(inventoryData)
                        ? inventoryData.filter((item) => item.category === "Dewormer").map((item) => item.label)
                        : []
                );
                setPreservedMedications(
                    Array.isArray(medicationData)
                        ? medicationData.map((item) =>
                            mapCareResponseToEntry(item, "medication_name", "horse_medication_id")
                        )
                        : []
                );
                setPreservedSupplements(
                    Array.isArray(supplementData)
                        ? supplementData.map((item) =>
                            mapCareResponseToEntry(item, "supplement_name", "horse_supplements_id")
                        )
                        : []
                );
            } catch (error) {
                setSubmitStatus({
                    type: "error",
                    message: error.message || "Failed to load medical form options."
                });
            } finally {
                setLoadingOptions(false);
            }
        }

        fetchOptions();
    }, [horseId]);

    function updateField(fieldName, value) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    }

    function validateForm() {
        const nextErrors = {};

        if (!formData.vetClinic.trim()) {
            nextErrors.vetClinic = "Vet clinic is required.";
        }

        if (!formData.vetName.trim()) {
            nextErrors.vetName = "Vet name is required.";
        }

        if (!formData.vetPhone.trim()) {
            nextErrors.vetPhone = "Vet phone is required.";
        }

        if (!formData.isSameVet) {
            if (!formData.emergencyClinic.trim()) {
                nextErrors.emergencyClinic = "Emergency clinic is required.";
            }

            if (!formData.emergencyVetName.trim()) {
                nextErrors.emergencyVetName = "Emergency vet name is required.";
            }

            if (!formData.emergencyVetPhone.trim()) {
                nextErrors.emergencyVetPhone = "Emergency vet phone is required.";
            }
        }

        if (!formData.emergencyAuthorization && !formData.emergencyInstructions.trim()) {
            nextErrors.emergencyInstructions = "Emergency instructions are required when emergency treatment is not authorized.";
        }

        return nextErrors;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const nextErrors = validateForm();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setSubmitStatus({
                type: "error",
                message: "Please fix the highlighted medical fields before saving."
            });
            return;
        }

        setSubmitStatus({ type: "", message: "" });

        try {
            const payload = {
                horse_id: horseId,
                vetClinic: formData.vetClinic,
                vetName: formData.vetName,
                vetPhone: formData.vetPhone,

                isSameVet: formData.isSameVet,
                emergencyClinic: formData.isSameVet ? null : (formData.emergencyClinic || null),
                emergencyVetName: formData.isSameVet ? null : (formData.emergencyVetName || null),
                emergencyVetPhone: formData.isSameVet ? null : (formData.emergencyVetPhone || null),
                emergencyAuthorization: formData.emergencyAuthorization,
                emergencyInstructions: formData.emergencyInstructions || null,

                rabiesExpiration: formData.rabiesExpiration || null,
                tetanusExpiration: formData.tetanusExpiration || null,
                westNileExpiration: formData.westNileExpiration || null,
                eeeWeeExpiration: formData.eeeWeeExpiration || null,
                fluRhinoExpiration: formData.fluRhinoExpiration || null,
                cogginsExpiration: formData.cogginsExpiration || null,

                hasShoes: formData.hasShoes,
                farrierName: formData.farrierName || null,
                farrierPhone: formData.farrierPhone || null,
                farrierDate: formData.farrierDate || null,
                dentistName: formData.dentistName || null,
                dentistPhone: formData.dentistPhone || null,
                dentalDate: formData.dentalDate || null,
                chiropractorName: formData.chiropractorName || null,
                chiropractorPhone: formData.chiropractorPhone || null,
                chiropractorDate: formData.chiropractorDate || null,
                massageTherapist: formData.massageTherapist || null,
                therapistPhone: formData.therapistPhone || null,
                massageDate: formData.massageDate || null,
                lastDewormer: formData.lastDewormer || null,
                dewormProvider: formData.dewormProvider || null,
                dewormDate: formData.dewormDate || null,

                allergies: formData.allergies,
                medicalConditions: formData.medicalConditions,
                medications: sanitizeCareEntries(preservedMedications),
                supplements: sanitizeCareEntries(preservedSupplements),
                medicalNotes: formData.medicalNotes || null
            };

            const response = await fetch(`http://127.0.0.1:8002/api/medical_records/horses/${horseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to update medical record."));
            }

            const data = await response.json();
            onSaved(data, formData.lastDewormer);
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to update medical record."
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

            {loadingOptions && <div className="formAlert">Loading medical form options...</div>}

            <div className="formSection">
                <h3>Edit Primary Veterinarian</h3>
                <div className="inventory-form-row1">
                    <TextField
                        id="edit-vetClinic"
                        label={<b>Veterinarian Clinic: </b>}
                        value={formData.vetClinic}
                        onChange={(value) => updateField("vetClinic", value)}
                        isRequired={true}
                        error={errors.vetClinic || ""}
                    />

                    <TextField
                        id="edit-vetName"
                        label={<b>Veterinarian Name: </b>}
                        value={formData.vetName}
                        onChange={(value) => updateField("vetName", value)}
                        isRequired={true}
                        error={errors.vetName || ""}
                    />

                    <TextField
                        id="edit-vetPhone"
                        label={<b>Phone Number: </b>}
                        value={formData.vetPhone}
                        onChange={(value) => updateField("vetPhone", value)}
                        isRequired={true}
                        error={errors.vetPhone || ""}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Emergency Care</h3>
                <div className="inventory-form-row3">
                    <CheckboxField
                        id="edit-isSameVet"
                        label="Same as primary veterinarian"
                        checked={formData.isSameVet}
                        onChange={(value) => updateField("isSameVet", value)}
                    />
                </div>

                {!formData.isSameVet && (
                    <div className="inventory-form-row1">
                        <TextField
                            id="edit-emergencyClinic"
                            label={<b>Emergency Vet Clinic: </b>}
                            value={formData.emergencyClinic}
                            onChange={(value) => updateField("emergencyClinic", value)}
                            isRequired={true}
                            error={errors.emergencyClinic || ""}
                        />

                        <TextField
                            id="edit-emergencyVetName"
                            label={<b>Emergency Vet Name: </b>}
                            value={formData.emergencyVetName}
                            onChange={(value) => updateField("emergencyVetName", value)}
                            isRequired={true}
                            error={errors.emergencyVetName || ""}
                        />

                        <TextField
                            id="edit-emergencyVetPhone"
                            label={<b>Emergency Phone Number: </b>}
                            value={formData.emergencyVetPhone}
                            onChange={(value) => updateField("emergencyVetPhone", value)}
                            isRequired={true}
                            error={errors.emergencyVetPhone || ""}
                        />
                    </div>
                )}

                <div className="inventory-form-row3">
                    <CheckboxField
                        id="edit-emergencyAuthorization"
                        label="Authorize emergency veterinary care if the owner cannot be reached"
                        checked={formData.emergencyAuthorization}
                        onChange={(value) => updateField("emergencyAuthorization", value)}
                    />
                </div>

                <div className="inventory-form-row4">
                    <TextAreaField
                        id="edit-emergencyInstructions"
                        label={<b>Emergency Instructions: </b>}
                        value={formData.emergencyInstructions}
                        onChange={(value) => updateField("emergencyInstructions", value)}
                        maxLength={1000}
                        error={errors.emergencyInstructions || ""}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Vaccination & Health Records</h3>
                <div className="inventory-form-row2">
                    <TextField
                        id="edit-rabiesExpiration"
                        type="date"
                        label={<b>Rabies Expiration Date: </b>}
                        value={formData.rabiesExpiration}
                        onChange={(value) => updateField("rabiesExpiration", value)}
                    />

                    <TextField
                        id="edit-tetanusExpiration"
                        type="date"
                        label={<b>Tetanus Expiration Date: </b>}
                        value={formData.tetanusExpiration}
                        onChange={(value) => updateField("tetanusExpiration", value)}
                    />

                    <TextField
                        id="edit-westNileExpiration"
                        type="date"
                        label={<b>West Nile Expiration Date: </b>}
                        value={formData.westNileExpiration}
                        onChange={(value) => updateField("westNileExpiration", value)}
                    />

                    <TextField
                        id="edit-eeeWeeExpiration"
                        type="date"
                        label={<b>EEE/WEE Expiration Date: </b>}
                        value={formData.eeeWeeExpiration}
                        onChange={(value) => updateField("eeeWeeExpiration", value)}
                    />

                    <TextField
                        id="edit-fluRhinoExpiration"
                        type="date"
                        label={<b>Flu/Rhino Expiration Date: </b>}
                        value={formData.fluRhinoExpiration}
                        onChange={(value) => updateField("fluRhinoExpiration", value)}
                    />

                    <TextField
                        id="edit-cogginsExpiration"
                        type="date"
                        label={<b>Coggins Test Due Date: </b>}
                        value={formData.cogginsExpiration}
                        onChange={(value) => updateField("cogginsExpiration", value)}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Preventative Care</h3>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded" aria-hidden="true">construction</span>
                    Farrier
                </h4>
                <div className="inventory-form-row3">
                    <CheckboxField
                        id="edit-hasShoes"
                        label="Horse currently wears shoes"
                        checked={formData.hasShoes}
                        onChange={(value) => updateField("hasShoes", value)}
                    />
                </div>

                <div className="inventory-form-row1">
                    <TextField
                        id="edit-farrierName"
                        label={<b>Farrier Name: </b>}
                        value={formData.farrierName}
                        onChange={(value) => updateField("farrierName", value)}
                    />
                    <TextField
                        id="edit-farrierPhone"
                        label={<b>Farrier Phone: </b>}
                        value={formData.farrierPhone}
                        onChange={(value) => updateField("farrierPhone", value)}
                    />
                    <TextField
                        id="edit-farrierDate"
                        type="date"
                        label={<b>Last Farrier Visit: </b>}
                        value={formData.farrierDate}
                        onChange={(value) => updateField("farrierDate", value)}
                    />
                </div>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded" aria-hidden="true">dentistry</span>
                    Dental
                </h4>
                <div className="inventory-form-row1">
                    <TextField
                        id="edit-dentistName"
                        label={<b>Dentist Name: </b>}
                        value={formData.dentistName}
                        onChange={(value) => updateField("dentistName", value)}
                    />
                    <TextField
                        id="edit-dentistPhone"
                        label={<b>Dentist Phone: </b>}
                        value={formData.dentistPhone}
                        onChange={(value) => updateField("dentistPhone", value)}
                    />
                    <TextField
                        id="edit-dentalDate"
                        type="date"
                        label={<b>Last Dental Visit: </b>}
                        value={formData.dentalDate}
                        onChange={(value) => updateField("dentalDate", value)}
                    />
                </div>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded" aria-hidden="true">accessibility_new</span>
                    Chiropractor
                </h4>
                <div className="inventory-form-row1">
                    <TextField
                        id="edit-chiropractorName"
                        label={<b>Chiropractor Name: </b>}
                        value={formData.chiropractorName}
                        onChange={(value) => updateField("chiropractorName", value)}
                    />
                    <TextField
                        id="edit-chiropractorPhone"
                        label={<b>Chiropractor Phone: </b>}
                        value={formData.chiropractorPhone}
                        onChange={(value) => updateField("chiropractorPhone", value)}
                    />
                    <TextField
                        id="edit-chiropractorDate"
                        type="date"
                        label={<b>Last Chiropractic Visit: </b>}
                        value={formData.chiropractorDate}
                        onChange={(value) => updateField("chiropractorDate", value)}
                    />
                </div>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded" aria-hidden="true">spa</span>
                    Massage
                </h4>
                <div className="inventory-form-row1">
                    <TextField
                        id="edit-massageTherapist"
                        label={<b>Massage Therapist: </b>}
                        value={formData.massageTherapist}
                        onChange={(value) => updateField("massageTherapist", value)}
                    />
                    <TextField
                        id="edit-therapistPhone"
                        label={<b>Therapist Phone: </b>}
                        value={formData.therapistPhone}
                        onChange={(value) => updateField("therapistPhone", value)}
                    />
                    <TextField
                        id="edit-massageDate"
                        type="date"
                        label={<b>Last Massage Visit: </b>}
                        value={formData.massageDate}
                        onChange={(value) => updateField("massageDate", value)}
                    />
                </div>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded" aria-hidden="true">science</span>
                    Deworming
                </h4>
                <div className="inventory-form-row1">
                    <DropdownField
                        id="edit-lastDewormer"
                        label={<b>Last Dewormer: </b>}
                        options={dewormers}
                        value={formData.lastDewormer}
                        onChange={(value) => updateField("lastDewormer", value)}
                        allowCustom={false}
                    />
                    <TextField
                        id="edit-dewormProvider"
                        label={<b>Deworm Provider: </b>}
                        value={formData.dewormProvider}
                        onChange={(value) => updateField("dewormProvider", value)}
                    />
                    <TextField
                        id="edit-dewormDate"
                        type="date"
                        label={<b>Deworm Date: </b>}
                        value={formData.dewormDate}
                        onChange={(value) => updateField("dewormDate", value)}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Conditions & Allergies</h3>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded" aria-hidden="true">medical_information</span>
                    Health Conditions
                </h4>
                <div className="inventory-form-row3">
                    <TagSearchField
                        label="Health Conditions"
                        value={formData.medicalConditions}
                        onChange={(value) => updateField("medicalConditions", value)}
                        options={healthConditions}
                        placeholder="Type to search or add a health condition..."
                    />
                </div>

                <h4 className="subSectionHeader">
                    <span className="material-symbols-rounded" aria-hidden="true">coronavirus</span>
                    Allergies
                </h4>
                <div className="inventory-form-row3">
                    <TagSearchField
                        label="Allergies"
                        value={formData.allergies}
                        onChange={(value) => updateField("allergies", value)}
                        options={allergies}
                        placeholder="Type to search or add an allergy..."
                    />
                </div>

                <div className="inventory-form-row4">
                    <TextAreaField
                        id="edit-medicalNotes"
                        label={<b>Medical Notes: </b>}
                        value={formData.medicalNotes}
                        onChange={(value) => updateField("medicalNotes", value)}
                        maxLength={1000}
                    />
                </div>
            </div>

            <div className="profileActionRow">
                <button type="button" className="profileActionButton secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="profileActionButton">
                    Save Medical Record
                </button>
            </div>
        </form>
    );
}

export default MedicalRecordEditForm;
