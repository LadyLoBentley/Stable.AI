import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {handleBlur} from "../../utils/FormUtil.js";
import TextField from "../../components/Form/TextField.jsx";
import TagSearchField from "../../components/Form/TagSearchField.jsx";
import CareScheduleField from "../../components/Form/CareScheduleField.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import Button from "../../components/Button/Button.jsx";
import CheckboxField from "../../components/Form/Checkbox.jsx";
import DropdownField from "../../components/Form/DropdownField.jsx";


function MedicalForm() {
    const { formData, setFormData } = useOutletContext();
    const navigate = useNavigate();


    const [touched, setTouched] = useState({
        vetClinic: false,
        vetName: false,
        vetPhone: false,

        isSameVet: false,
        emergencyClinic: false,
        emergencyVetName: false,
        emergencyVetPhone: false,
        emergencyAuthorization: false,
        emergencyInstructions: false,

        rabiesExpiration: false,
        tetanusExpiration: false,
        westNileExpiration: false,
        eeeeWeeExpiration: false,
        fluRhinoExpiration: false,
        cogginsExpiration: false,

        hasShoes: false,
        farrierName: false,
        farrierPhone: false,
        farrierDate: false,
        dentistName: false,
        dentistPhone: false,
        dentalDate: false,
        chiropractorName: false,
        chiropractorPhone: false,
        chiropractorDate: false,
        massageTherapist: false,
        therapistPhone: false,
        massageDate: false,
        lastDewormer: false,
        dewormProvider: false,
        dewormDate: false,

        medicalConditions: false,
        allergies: false,
        medications: false,
        supplements: false,
        medicalNotes: false,
    });

    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    const [errors, setErrors] = useState({});

    function validateField(name, value) {
        switch (name) {
            case "vetClinic":
                if (!value?.trim()) return "Name of vet clinic is required.";
                return "";

            case "vetName":
                if (!value?.trim()) return "Veterinarian name is required.";
                return "";

            case "vetPhone":
                if (!value?.trim()) return "Veterinarian phone number  is required.";
                return "";

            case "emergencyClinic":
                if (!formData.isSameVet && !value?.trim()) return "Emergency vet clinic is required.";
                return "";

            case "emergencyVetName":
                if (!formData.isSameVet && !value?.trim()) return "Emergency veterinarian name is required.";
                return "";

            case "emergencyVetPhone":
                if (!formData.isSameVet && !value?.trim()) return "Emergency veterinarian phone number is required.";
                return "";

            case "emergencyInstructions":
                if (!formData.emergencyAuthorization && !value?.trim()) {
                    return "Emergency instructions are required when emergency treatment is not fully authorized.";
                }
                return "";

            default:
                return "";
        }
    }

    //----------------------HEALTH CONDITIONS---------------------\\
    const [healthConditions, setHealthConditions] = useState([]);
    const [healthConditionsLoading, setHealthConditionsLoading] = useState(true);
    const [healthConditionsError, setHealthConditionsError] = useState("");

    useEffect(() => {
        async function fetchHealthConditions() {
            try {
                setHealthConditionsLoading(true);
                setHealthConditionsError("");

                const response = await fetch("http://localhost:8002/api/health/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch health conditions: ${response.status}`);
                }

                const data = await response.json();

                const conditionNames = Array.isArray(data)
                    ? data.map((condition) => condition.name)
                    : [];

                setHealthConditions(conditionNames);
            } catch (error) {
                console.error("Error fetching health conditions:", error);
                setHealthConditionsError(`Could not fetch health conditions: ${error.message}`);
            } finally {
                setHealthConditionsLoading(false);
            }
        }

        fetchHealthConditions();
    }, []);

    //----------------------ALLERGIES---------------------\\
    const [allergies, setAllergies] = useState([]);
    const [allergiesLoading, setAllergiesLoading] = useState(true);
    const [allergiesError, setAllergiesError] = useState("");

    useEffect(() => {
        async function fetchAllergies() {
            try {
                setAllergiesLoading(true);
                setAllergiesError("");

                const response = await fetch("http://localhost:8002/api/allergies/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch allergies: ${response.status}`);
                }

                const data = await response.json();

                const allergyNames = Array.isArray(data)
                    ? data.map((allergy) => allergy.name)
                    : [];

                setAllergies(allergyNames);
            } catch (error) {
                console.error("Error fetching allergies:", error);
                setAllergiesError(`Could not fetch allergies: ${error.message}`);
            } finally {
                setAllergiesLoading(false);
            }
        }

        fetchAllergies();
    }, []);

    //-------------------------MEDICATIONS--------------------------\\
    const [medications, setMedications] = useState([]);
    const [medicationsLoading, setMedicationsLoading] = useState(true);
    const [medicationsError, setMedicationsError] = useState("");

    useEffect(() => {
        async function fetchMedications() {
            try {
                setMedicationsLoading(true);
                setMedicationsError("");

                const response = await fetch("http://localhost:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch medication: ${response.status}`);
                }

                const data = await response.json();

                const medicationNames = Array.isArray(data)
                    ? data
                        .filter((item) => item.category === "Medication")
                        .map((item) => item.label)
                    : [];

                setMedications(medicationNames);
            }
            catch (error) {
                console.error("Error fetching medications:", error);
                setMedicationsError(`Could not fetch medications: ${error.message}`);
            }
            finally {
                setMedicationsLoading(false);
            }
        }

        fetchMedications();
    }, []);

    //-------------------------SUPPLEMENTS--------------------------\\
    const [supplements, setSupplements] = useState([]);
    const [supplementsLoading, setSupplementsLoading] = useState(true);
    const [supplementsError, setSupplementsError] = useState("");

    useEffect(() => {
        async function fetchSupplements() {
            try {
                setSupplementsLoading(true);
                setSupplementsError("");

                const response = await fetch("http://localhost:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch supplements: ${response.status}`);
                }

                const data = await response.json();

                const supplementNames = Array.isArray(data)
                    ? data
                        .filter((item) => item.category === "Supplements")
                        .map((item) => item.label)
                    : [];

                setSupplements(supplementNames);
            } catch (error) {
                console.error("Error fetching supplements:", error);
                setSupplementsError(`Could not fetch supplements: ${error.message}`);
            } finally {
                setSupplementsLoading(false);
            }
        }

                fetchSupplements();
    }, []);

    //-------------------------DEWORMER--------------------------\\
    const [dewormer, setDewormer] = useState([]);
    const [dewormerLoading, setDewormerLoading] = useState(true);
    const [dewormerError, setDewormerError] = useState("");

    useEffect(() => {
        async function fetchDewormer() {
            try {
                setDewormerLoading(true);
                setDewormerError("");

                const response = await fetch("http://localhost:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch dewormer: ${response.status}`);
                }

                const data = await response.json();

                const dewormerNames = Array.isArray(data)
                    ? data
                        .filter((item) => item.category === "Dewormer")
                        .map((item) => item.label)
                    : [];

                setDewormer(dewormerNames);
            } catch (error) {
                console.error("Error fetching dewormer:", error);
                setDewormerError(`Could not fetch dewormer: ${error.message}`);
            } finally {
                setDewormerLoading(false);
            }
        }

                fetchDewormer();
    }, []);

    function updateField(fieldName, value) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));

        if (fieldName === "emergencyAuthorization") {
            setErrors((prev) => ({
                ...prev,
                emergencyInstructions: value
                    ? ""
                    : prev.emergencyInstructions
            }));
        }

        if (touched[fieldName]) {
            setErrors((prev) => ({
                ...prev,
                [fieldName]: validateField(fieldName, value)
            }));
        }
    }

    useEffect(() => {
        if (!submitStatus.message) return;

        const timer = setTimeout(() => {
            setSubmitStatus({
                type: "",
                message: ""
            });
        }, 10000);

        return () => clearTimeout(timer);
    }, [submitStatus]);

    async function handleSubmit(e) {
        e.preventDefault();

        const newTouched = {
            vetClinic: true,
            vetName: true,
            vetPhone: true,

            isSameVet: true,
            emergencyClinic: true,
            emergencyVetName: true,
            emergencyVetPhone: true,
            emergencyAuthorization: true,
            emergencyInstructions: true,

            rabiesExpiration: true,
            tetanusExpiration: true,
            westNileExpiration: true,
            eeeWeeExpiration: true,
            fluRhinoExpiration: true,
            cogginsExpiration: true,

            hasShoes: true,
            farrierName: true,
            farrierPhone: true,
            farrierDate: true,
            dentistName: true,
            dentistPhone: true,
            dentalDate: true,
            chiropractorName: true,
            chiropractorPhone: true,
            chiropractorDate: true,
            massageTherapist: true,
            therapistPhone: true,
            massageDate: true,
            lastDewormer: true,
            dewormProvider: true,
            dewormDate: true,

            medicalConditions: true,
            allergies: true,
            medications: true,
            supplements: true,
            medicalNotes: true
        };

        setTouched(newTouched);

        const newErrors = {
            vetClinic: validateField("vetClinic", formData.vetClinic),
            vetName: validateField("vetName", formData.vetName),
            vetPhone: validateField("vetPhone", formData.vetPhone),

            isSameVet: validateField("isSameVet", formData.vetPhone),
            emergencyClinic: validateField("emergencyClinic", formData.emergencyClinic),
            emergencyVetName: validateField("emergencyVetName", formData.emergencyVetName),
            emergencyVetPhone: validateField("emergencyVetPhone", formData.emergencyVetPhone),
            emergencyAuthorization: validateField("emergencyAuthorization", formData.emergencyAuthorization),
            emergencyInstructions: validateField("emergencyInstructions", formData.emergencyInstructions),

            rabiesExpiration: validateField("rabiesExpiration", formData.rabiesExpiration),
            tetanusExpiration: validateField("tetanusExpiration", formData.tetanusExpiration),
            westNileExpiration: validateField("westNileExpiration", formData.westNileExpiration),
            eeWeeExpiration: validateField("eeWeeExpiration", formData.eeWeeExpiration),
            fluRhinoExpiration: validateField("fluRhinoExpiration", formData.fluRhinoExpiration),
            cogginsExpiration: validateField("cogginsExpiration", formData.cogginsExpiration),

            hasShoes: validateField("hasShoes", formData.hasShoes),
            farrierName: validateField("farrierName", formData.farrierName),
            farrierPhone: validateField("farrierPhone", formData.farrierPhone),
            farrierDate: validateField("farrierDate", formData.farrierDate),
            dentistName: validateField("dentistName", formData.dentistName),
            dentistPhone: validateField("dentistPhone", formData.dentistPhone),
            dentalDate: validateField("dentalDate", formData.dentalDate),
            chiropractorName: validateField("chiropractorName", formData.chiropractorName),
            chiropractorPhone: validateField("chiropractorPhone", formData.chiropractorPhone),
            chiropractorDate: validateField("chiropractorDate", formData.chiropractorDate),
            massageTherapist: validateField("massageTherapist", formData.massageTherapist),
            therapistPhone: validateField("therapistPhone", formData.therapistPhone),
            massageDate: validateField("massageDate", formData.massageDate),
            lastDewormer: validateField("lastDewormer", formData.lastDewormer),
            dewormProvider: validateField("dewormProvider", formData.dewormProvider),
            dewormDate: validateField("dewormDate", formData.dewormDate),

            medicalConditions: validateField("medicalConditions", formData.medicalConditions),
            allergies: validateField("allergies", formData.allergies),
            medications: validateField("medications", formData.medications),
            supplements: validateField("supplements", formData.supplements),
            medicalNotes: validateField("medicalNotes", formData.medicalNotes)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error);

        if (hasErrors) {
            setSubmitStatus({
                type: "error",
                message: "Please fix the highlighted fields before submitting."
            });
            return;
        }

        navigate("food");
    }

    return (
        <div className="formContainer">
            <h2>Medical Information</h2>

            {submitStatus.message && (
                <div
                    className={
                    submitStatus.type === "success"
                        ? "formAlert success"
                        : "formAlert error"
                    }
                >
                    {submitStatus.message}
                </div>
            )}

            {healthConditionsLoading && (
                <div className="formAlert">
                    Loading health conditions...
                </div>
            )}

            {healthConditionsError && (
                <div className="formAlert error">
                    {healthConditionsError}
                </div>
            )}

            {allergiesLoading && (
                <div className="formAlert">
                    Loading allergies...
                </div>
            )}

            {allergiesError && (
                <div className="formAlert error">
                    {allergiesError}
                </div>
            )}

            {medicationsLoading && (
                <div className="formAlert">
                    Loading medications...
                </div>
            )}

            {medicationsError && (
                <div className="formAlert error">
                    {medicationsError}
                </div>
            )}

            {supplementsLoading && (
                <div className="formAlert">
                    Loading supplements...
                </div>
            )}

            {supplementsError && (
                <div className="formAlert error">
                    {supplementsError}
                </div>
            )}

            {dewormerLoading && (
                <div className="formAlert">
                    Loading deworming medications...
                </div>
            )}

            {supplementsError && (
                <div className="formAlert error">
                    {dewormerError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="formInputs">
                    <div className="formNote">
                        Don’t see a medication or supplement? You can add it to inventory after submission and assign it to this horse from the medical profile.
                    </div>

                    <div className="formSection">
                        <h3>Primary Veterinarian</h3>

                        <div className="inventory-form-row1">
                            <TextField
                                id="vetClinic"
                                label={<b>Veterinarian Clinic: </b>}
                                placeholder="Enter name of vet clinic"
                                value={formData.vetClinic}
                                onChange={(value) => updateField("vetClinic", value)}
                                icon_label="Vet clinic help"
                                title="Vet Clinic"
                                body="Enter the veterinary practice or mobile veterinarian that normally treats this horse. If using a mobile vet, enter the business name. This helps ensure emergency contact information is available."
                                isRequired={true}
                                error={touched.vetClinic ? errors.vetClinic : ""}
                                onBlur={() => handleBlur("vetClinic", formData.vetClinic, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="vetName"
                                label={<b>Veterinarian Name: </b>}
                                placeholder="Enter vet name"
                                value={formData.vetName}
                                onChange={(value) => updateField("vetName", value)}
                                icon_label="Primary veterinarian help"
                                title="Primary Veterinarian"
                                body="Enter the veterinarian normally responsible for this horse’s care. This may differ from the clinic if multiple veterinarians are available."
                                isRequired={true}
                                error={touched.vetName ? errors.vetName : ""}
                                onBlur={() => handleBlur("vetName", formData.vetName, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="vetPhone"
                                label={<b>Phone Number: </b>}
                                placeholder="Enter vet's phone number"
                                value={formData.vetPhone}
                                onChange={(value) => updateField("vetPhone", value)}
                                icon_label="Primary phone number help"
                                title="Primary Phone Number"
                                body="Enter the main phone number for the veterinarian or mobile practice responsible for this horse. This should be the number used for routine care and emergencies."
                                isRequired={true}
                                error={touched.vetPhone ? errors.vetPhone : ""}
                                onBlur={() => handleBlur("vetPhone", formData.vetPhone, setTouched, setErrors, validateField)}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Emergency Care</h3>

                        <div className="inventory-form-row3">
                            <CheckboxField
                                id="sameVet"
                                label="Same as primary veterinarian"
                                checked={formData.isSameVet}
                                onChange={(value) => updateField("isSameVet", value)}
                                title="Same as primary veterinarian"
                                body="Check if your primary veterinarian also provide emergency services. Otherwise, enter the emergency vet information. This is who we call when there is an emergency."
                                isRequired={false}
                                error={touched.isSameVet ? errors.isSameVet : ""}
                                onBlur={() => setTouched((prev) => ({ ...prev, isSameVet: true }))}
                            />
                        </div>

                        {!formData.isSameVet && (
                            <div className="inventory-form-row1">
                                <TextField
                                    id="emergencyClinic"
                                    label={<b>Emergency Vet Clinic: </b>}
                                    placeholder="Enter name of emergency vet clinic"
                                    value={formData.emergencyClinic}
                                    onChange={(value) => updateField("emergencyClinic", value)}
                                    isRequired={!formData.isSameVet}
                                    error={touched.emergencyClinic ? errors.emergencyClinic : ""}
                                    onBlur={() => handleBlur("emergencyClinic", formData.emergencyClinic, setTouched, setErrors, validateField)}
                                />

                                <TextField
                                    id="EmergencyVetName"
                                    label={<b>Emergency Vet Name: </b>}
                                    placeholder="Enter emergency vet name"
                                    value={formData.emergencyVetName}
                                    onChange={(value) => updateField("emergencyVetName", value)}
                                    isRequired={!formData.isSameVet}
                                    error={touched.emergencyVetName ? errors.emergencyVetName : ""}
                                    onBlur={() => handleBlur("emergencyVetName", formData.emergencyVetName, setTouched, setErrors, validateField)}
                                />

                                <TextField
                                    id="emergencyVetPhone"
                                    label={<b>Emergency Phone Number: </b>}
                                    placeholder="Enter vet's phone number"
                                    value={formData.emergencyVetPhone}
                                    onChange={(value) => updateField("emergencyVetPhone", value)}
                                    isRequired={!formData.isSameVet}
                                    error={touched.emergencyVetPhone ? errors.emergencyVetPhone : ""}
                                    onBlur={() => handleBlur("emergencyVetPhone", formData.emergencyVetPhone, setTouched, setErrors, validateField)}
                                />
                            </div>
                        )}

                        <div className="inventory-form-row3">
                            <CheckboxField
                                id="emergencyAuthorization"
                                label="Authorize emergency veterinary care if owner and emergency contact cannot be reached"
                                checked={formData.emergencyAuthorization}
                                onChange={(value) => updateField("emergencyAuthorization", value)}
                                title="Authorize emergency veterinary care if owner cannot be reached"
                                body="Check this to allow the barn to contact a veterinarian and approve emergency treatment when the owner or emergency contact cannot be reached in time."
                                isRequired={false}
                                error={touched.emergencyAuthorization ? errors.emergencyAuthorization : ""}
                                onBlur={() => setTouched((prev) => ({ ...prev, emergencyAuthorization: true }))}
                            />
                        </div>

                        <div className="inventory-form-row4">
                            <TextAreaField
                                id="emergencyInstructions"
                                label={
                                    <b>
                                        {formData.emergencyAuthorization
                                            ? "Emergency Care Instructions (Optional):"
                                            : "Emergency Instructions (Required):"}
                                    </b>
                                }
                                value={formData.emergencyInstructions}
                                placeholder="Enter any additional notes that may be useful for caregivers. If you added a condition or allergy not listed, please give details and instructions to help best support the animal."
                                onChange={(value) =>updateField("emergencyInstructions", value)}
                                maxLength={1000}
                                icon_label="Emergency instructions help"
                                title="Emergency instructions"
                                body={
                                    formData.emergencyAuthorization
                                        ? "Emergency treatment is fully authorized, so instructions are optional. Add notes only if there are special preferences or limits."
                                        : "Since emergency care is not authorized, explain what staff should do if the owner cannot be reached."
                                }
                                isRequired={!formData.emergencyAuthorization}
                                error={touched.emergencyInstructions ? errors.emergencyInstructions : ""}
                                onBlur={() =>
                                    handleBlur(
                                        "emergencyInstructions",
                                        formData.emergencyInstructions,
                                        setTouched,
                                        setErrors,
                                        validateField
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Vaccination & Health Records</h3>
                        <div className="inventory-form-row2">
                            <TextField
                                id="rabiesExpiration"
                                type="date"
                                className="dateInput"
                                label={<b>Rabies Expiration Date: </b>}
                                value={formData.rabiesExpiration}
                                onChange={(value) => updateField("rabiesExpiration", value)}
                                icon_label="Rabies expiration help"
                                title="Rabies Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.rabiesExpiration ? errors.rabiesExpiration : ""}
                                onBlur={() => handleBlur("rabiesExpiration", formData.rabiesExpiration, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="tetanusExpiration"
                                type="date"
                                className="dateInput"
                                label={<b>Tetanus Expiration Date: </b>}
                                value={formData.tetanusExpiration}
                                onChange={(value) => updateField("tetanusExpiration", value)}
                                icon_label="Tetanus expiration help"
                                title="Tetanus Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.tetanusExpiration ? errors.tetanusExpiration : ""}
                                onBlur={() => handleBlur("tetanusExpiration", formData.tetanusExpiration, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="westNileExpiration"
                                type="date"
                                className="dateInput"
                                label={<b>West Nile Expiration Date: </b>}
                                value={formData.westNileExpiration}
                                onChange={(value) => updateField("westNileExpiration", value)}
                                icon_label="West Nile expiration help"
                                title="West Nile Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.westNileExpiration ? errors.westNileExpiration : ""}
                                onBlur={() => handleBlur("westNileExpiration", formData.westNileExpiration, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="eeeWeeExpiration"
                                type="date"
                                className="dateInput"
                                label={<b>EEE/WEE Expiration Date: </b>}
                                value={formData.eeeWeeExpiration}
                                onChange={(value) => updateField("eeeWeeExpiration", value)}
                                icon_label="EEE/WEE expiration help"
                                title="EEE/WEE Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.eeeWeeExpiration ? errors.eeeWeeExpiration : ""}
                                onBlur={() => handleBlur("eeeWeeExpiration", formData.eeeWeeExpiration, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="fluRhinoExpiration"
                                type="date"
                                className="dateInput"
                                label={<b>Flu/Rhino Expiration Date: </b>}
                                value={formData.fluRhinoExpiration}
                                onChange={(value) => updateField("fluRhinoExpiration", value)}
                                icon_label="Flu/Rhino expiration help"
                                title="Flu/Rhino Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.fluRhinoExpiration ? errors.fluRhinoExpiration : ""}
                                onBlur={() => handleBlur("fluRhinoExpiration", formData.fluRhinoExpiration, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="cogginsExpiration"
                                type="date"
                                className="dateInput"
                                label={<b>Coggins Test Due Date: </b>}
                                value={formData.cogginsExpiration}
                                onChange={(value) => updateField("cogginsExpiration", value)}
                                icon_label="Coggins Test help"
                                title="Coggins Test Expiration Date"
                                body="Enter the expiration date if this test has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.cogginsExpiration ? errors.cogginsExpiration : ""}
                                onBlur={() => handleBlur("cogginsExpiration", formData.cogginsExpiration, setTouched, setErrors, validateField)}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Preventative Care</h3>

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">construction</span>
                            Farrier
                        </h4>
                        <div className="inventory-form-row3">
                            <CheckboxField
                                id="hasShoes"
                                label="Horse currently wears shoes"
                                checked={formData.hasShoes}
                                onChange={(value) => updateField("hasShoes", value)}
                                title="Shoes"
                                body="Check this if the horse is currently shod. Leave unchecked if the horse goes barefoot."
                                isRequired={false}
                                error={touched.hasShoes ? errors.hasShoes : ""}
                                onBlur={() => setTouched((prev) => ({ ...prev, hasShoes: true }))}
                            />
                        </div>

                        <div className="inventory-form-row1">
                            <TextField
                                id="farrierName"
                                label={<b>Farrier Name: </b>}
                                value={formData.farrierName}
                                onChange={(value) => updateField("farrierName", value)}
                                icon_label="Farrier Name Help"
                                title="Farrier Name"
                                body="Enter the name of the farrier who regularly trims or shoes this horse."
                                isRequired={false}
                                error={touched.farrierName ? errors.farrierName : ""}
                                onBlur={() => handleBlur("farrierName", formData.farrierName, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="farrierPhone"
                                label={<b>Farrier Phone: </b>}
                                value={formData.farrierPhone}
                                onChange={(value) => updateField("farrierPhone", value)}
                                icon_label="Farrier Phone Number Help"
                                title="Farrier Phone Number"
                                body="Enter the farrier's Phone Number in format: 555-555-5555."
                                isRequired={false}
                                error={touched.farrierPhone ? errors.farrierPhone : ""}
                                onBlur={() => handleBlur("farrierPhone", formData.farrierPhone, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="farrierDate"
                                type="date"
                                className="dateInput"
                                label={<b>Last Farrier Visit: </b>}
                                value={formData.farrierDate}
                                onChange={(value) => updateField("farrierDate", value)}
                                icon_label="Farrier visit help"
                                title="Farrier Last Visit Date"
                                body="Enter the date the horse was last seen by the farrier. This helps track hoof care schedules."
                                isRequired={false}
                                error={touched.farrierDate ? errors.farrierDate : ""}
                                onBlur={() => handleBlur("farrierDate", formData.farrierDate, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">dentistry</span>
                            Dental
                        </h4>
                        <div className="inventory-form-row1">
                            <TextField
                                id="dentistName"
                                label={<b>Dental Provider Name: </b>}
                                value={formData.dentistName}
                                onChange={(value) => updateField("dentistName", value)}
                                icon_label="Dental Provider help"
                                title="Dental Provider Name"
                                body="Enter the name of the equine dentist or veterinarian who performs the horse’s dental care."
                                isRequired={false}
                                error={touched.dentistName ? errors.dentistName : ""}
                                onBlur={() => handleBlur("dentistName", formData.dentistName, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="dentistPhone"
                                label={<b>Dentist Phone: </b>}
                                value={formData.dentistPhone}
                                onChange={(value) => updateField("dentistPhone", value)}
                                icon_label="Dentist phone help"
                                title="Dentist Phone Number"
                                body="Enter the dentist's phone number in format: 555-555-5555."
                                isRequired={false}
                                error={touched.dentistPhone ? errors.dentistPhone : ""}
                                onBlur={() => handleBlur("dentistPhone", formData.dentistPhone, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="dentalDate"
                                type="date"
                                className="dateInput"
                                label={<b>Last Dental Exam: </b>}
                                value={formData.dentalDate}
                                onChange={(value) => updateField("dentalDate", value)}
                                icon_label="Dental exam date help"
                                title="Last Dental Exam Date"
                                body="Enter the date the horse last received a dental exam. Dates may be entered even if only an estimate to maintain accurate medical history."
                                isRequired={false}
                                error={touched.dentalDate ? errors.dentalDate : ""}
                                onBlur={() => handleBlur("dentalDate", formData.dentalDate, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">accessibility_new</span>
                            Chiropractor
                        </h4>
                        <div className="inventory-form-row1">
                            <TextField
                                id="chiropractorName"
                                label={<b>Chiropractor Name: </b>}
                                value={formData.chiropractorName}
                                onChange={(value) => updateField("chiropractorName", value)}
                                icon_label="Chiropractor Name help"
                                title="Chiropractor Name"
                                body="Enter the name of the equine Chiropractor."
                                isRequired={false}
                                error={touched.chiropractorName ? errors.chiropractorName : ""}
                                onBlur={() => handleBlur("chiropractorName", formData.chiropractorName, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="chiropractorPhone"
                                label={<b>Chiropractor Phone: </b>}
                                value={formData.chiropractorPhone}
                                onChange={(value) => updateField("chiropractorPhone", value)}
                                icon_label="Chiropractor phone number help"
                                title="Chiropractor Phone Number"
                                body="Enter the Chiropractor's phone number in format: 555-555-5555."
                                isRequired={false}
                                error={touched.chiropractorPhone ? errors.chiropractorPhone : ""}
                                onBlur={() => handleBlur("chiropractorPhone", formData.chiropractorPhone, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="chiropractorDate"
                                type="date"
                                className="dateInput"
                                label={<b>Last Chiropractor Exam: </b>}
                                value={formData.chiropractorDate}
                                onChange={(value) => updateField("chiropractorDate", value)}
                                icon_label="Chiropractor appointment date help"
                                title="Last Chiropractor Date"
                                body="Enter the date the horse last received a chiropractor exam. Dates may be entered even if only an estimate to maintain accurate medical history."
                                isRequired={false}
                                error={touched.chiropractorDate ? errors.chiropractorDate : ""}
                                onBlur={() => handleBlur("chiropractorDate", formData.chiropractorDate, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">spa</span>
                            Massage
                        </h4>
                        <div className="inventory-form-row1">
                            <TextField
                                id="massageTherapist"
                                label={<b>Massage Therapist: </b>}
                                value={formData.massageTherapist}
                                onChange={(value) => updateField("massageTherapist", value)}
                                icon_label="Massage Therapist help"
                                title="Massage Therapist"
                                body="Enter the name of the equine massage therapist."
                                isRequired={false}
                                error={touched.massageTherapist ? errors.massageTherapist : ""}
                                onBlur={() => handleBlur("massageTherapist", formData.massageTherapist, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="therapistPhone"
                                label={<b>Therapist Phone: </b>}
                                value={formData.therapistPhone}
                                onChange={(value) => updateField("therapistPhone", value)}
                                icon_label="Therapist phone number help"
                                title="Massage Therapist Phone Number"
                                body="Enter the massage Therapist's phone number in format: 555-555-5555."
                                isRequired={false}
                                error={touched.therapistPhone ? errors.therapistPhone : ""}
                                onBlur={() => handleBlur("therapistPhone", formData.therapistPhone, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="massageDate"
                                type="date"
                                className="dateInput"
                                label={<b>Last Massage Therapy: </b>}
                                value={formData.massageDate}
                                onChange={(value) => updateField("massageDate", value)}
                                icon_label="Massage therapy help"
                                title="Last Massage Therapy Session"
                                body="Enter the date the horse last received mssage therapy. Dates may be entered even if only an estimate to maintain accurate medical history."
                                isRequired={false}
                                error={touched.massageDate ? errors.massageDate : ""}
                                onBlur={() => handleBlur("massageDate", formData.massageDate, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">science</span>
                            Deworming
                        </h4>
                        <div className="inventory-form-row1">
                            <DropdownField
                                id="lastDewormer"
                                label={<b>Last Dewormer Given: </b>}
                                options={dewormer}
                                value={formData.lastDewormer}
                                onChange={(value) => updateField("lastDewormer", value)}
                                allowCustom={false}
                                isRequired={false}
                                error={touched.lastDewormer ? errors.lastDewormer : ""}
                                onBlur={() =>
                                    handleBlur("lastDewormer", formData.lastDewormer, setTouched, setErrors, validateField)
                                }
                            />

                            <TextField
                                id="dewormProvider"
                                label={<b>Deworm Administrator: </b>}
                                value={formData.dewormProvider}
                                onChange={(value) => updateField("dewormProvider", value)}
                                icon_label="Deworm administrator help"
                                title="Deworm Administrator"
                                body="Enter the name of person who administered dewormer. This may be a staff member with explicit permission, veterinarian, or owner."
                                isRequired={false}
                                error={touched.dewormProvider ? errors.dewormProvider : ""}
                                onBlur={() => handleBlur("dewormProvider", formData.dewormProvider, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="dewormDate"
                                type="date"
                                className="dateInput"
                                label={<b>Last Deworm Treatment: </b>}
                                value={formData.dewormDate}
                                onChange={(value) => updateField("dewormDate", value)}
                                icon_label="Deworming date help"
                                title="Last Deworming Date"
                                body="Enter the date the horse was last dewormed. This helps track parasite management history.."
                                isRequired={false}
                                error={touched.dewormDate ? errors.dewormDate : ""}
                                onBlur={() => handleBlur("dewormDate", formData.dewormDate, setTouched, setErrors, validateField)}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Medical History</h3>

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">medical_information</span>
                            Health Conditions
                        </h4>
                        <div className="inventory-form-row3">
                            <TagSearchField
                                label="Medical Conditions"
                                value={formData.medicalConditions}
                                onChange={(value) => updateField("medicalConditions", value)}
                                options={healthConditions}
                                placeholder="Type to search conditions or add a new one if condition is not listed..."
                                allowCustom={true}
                                maxItems={15}
                                tipTitle="Medical Conditions"
                                tipBody="Search for an existing medical condition first. If you do not find a match, type a custom condition name and press Enter to add it."
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
                                placeholder="Type to search allergies or add a new one if allergy is not listed..."
                                allowCustom={true}
                                maxItems={15}
                                tipTitle="Allergies"
                                tipBody="Search for an existing allergy first. If you do not find a match, type a custom allergy name and press Enter to add it."
                            />
                        </div>

                        <div className="inventory-form-row4">
                            <TextAreaField
                                id="medicalNotes"
                                label={<b>Additional Notes: </b>}
                                value={formData.medicalNotes}
                                placeholder="Enter any additional notes that may be useful for caregivers. If you added a condition or allergy not listed, please give details and instructions to help best support the animal."
                                onChange={(value) =>updateField("medicalNotes", value)}
                                maxLength={1000}
                                icon_label="Medical notes help"
                                title="Additional Notes"
                                body="Add any other information about your horse's health to help support equine care. If the entries were not previously listed, please tell us more about condition."
                                isRequired={false}
                                error={touched.medicalNotes ? errors.medicalNotes : ""}
                                onBlur={() => handleBlur("medicalNotes", formData.medicalNotes, setTouched, setErrors, validateField)}
                                touched={touched.medicalNotes}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Ongoing Care</h3>

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">pill</span>
                            Medications
                        </h4>
                        <CareScheduleField
                            label="Medications"
                            value={formData.medications}
                            onChange={(value) => updateField("medications", value)}
                            itemOptions={medications}
                            conditionOptions={healthConditions}
                            itemTipTitle="Item"
                            itemTipBody="Add the medications assigned to the horse to the list. If not listed, add to inventory, and then update horse profile."
                            tipDosageTitle="Dosage"
                            tipDosageBody="Enter the required dosage recommended by the vet and/or product instructions. Do not exceed dosage Recommendations."
                            tipFrequencyTitle ="Frequency"
                            tipFrequencyBody="Enter How often to give medication: daily, weekly, monthly, or yearly."
                            tipAmTitle="AM Checkbox"
                            tipAmBody="Check if medication is given in the morning."
                            tipPmTitle="PM Checkbox"
                            tipPmBody="Check if medication is given in the evening."
                            tipNotesTitle="Medication Notes"
                            tipNotesBody="Add any additional notes that may be helpful to give the best care tailored to the horse."
                        />

                        <h4 className="subSectionHeader">
                            <span className="material-symbols-rounded" aria-hidden="true">nutrition</span>
                            Supplements
                        </h4>
                        <CareScheduleField
                            label="Supplements"
                            value={formData.supplements}
                            onChange={(value) => updateField("supplements", value)}
                            itemOptions={supplements}
                            conditionOptions={supplements}
                            itemTipTitle="Item"
                            itemTipBody="Add the supplement assigned to the horse to the list. If not listed, add to inventory, and then update horse profile."
                            tipDosageTitle="Dosage"
                            tipDosageBody="Enter the required dosage recommended by the vet and/or product instructions. Do not exceed dosage Recommendations."
                            tipFrequencyTitle ="Frequency"
                            tipFrequencyBody="Enter How often to give the supplement: daily, weekly, monthly, or yearly."
                            tipAmTitle="AM Checkbox"
                            tipAmBody="Check if supplement is given in the morning."
                            tipPmTitle="PM Checkbox"
                            tipPmBody="Check if supplement is given in the evening."
                            tipNotesTitle="Medication Notes"
                            tipNotesBody="Add any additional notes that may be helpful to give the best care tailored to the horse."
                        />
                    </div>

                    <div className="formButton">
                        <Button label="Back" variant="secondary" type="button" onClick={() => navigate(-1)} />
                        <Button label="Next" type="submit"/>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default MedicalForm;
