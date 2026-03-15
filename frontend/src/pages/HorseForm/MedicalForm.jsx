import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {handleBlur} from "../../utils/FormUtil.js";
import TextField from "../../components/Form/TextField.jsx";
import TagSearchField from "../../components/Form/TagSearchField.jsx";
import CareScheduleField from "../../components/Form/CareScheduleField.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import Button from "../../components/Button/Button.jsx";


function MedicalForm() {
    const { formData, setFormData } = useOutletContext();
    const navigate = useNavigate();


    const [touched, setTouched] = useState({
        vetClinic: false,
        vetName: false,
        vetPhone: false,

        rabiesExpire: false,
        tetanusExpire: false,
        westNileExpire: false,
        eeeWeeExpire: false,
        fluRhinoExpire: false,

        cogginsExpire: false,
        farrierDue: false,
        dentalDue: false,
        dewormDue: false,

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
            case "rabiesExpire":
            case "tetanusExpire":
            case "westNileExpire":
            case "eeeWeeExpire":
            case "fluRhinoExpire":
            case "cogginsExpire":
            case "farrierDue":
            case "dentalDue":
            case "dewormDue":
            case "medicalConditions":
            case "allergies":
            case "medications":
            case "supplements":
            case "medicalNotes":
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

    function updateField(fieldName, value) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));

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

            rabiesExpire: true,
            tetanusExpire: true,
            westNileExpire: true,
            eeeWeeExpire: true,
            fluRhinoExpire: true,

            cogginsExpire: true,
            farrierDue: true,
            dentalDue: true,
            dewormDue: true,

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

            rabiesExpire: validateField("rabiesExpire", formData.rabiesExpire),
            tetanusExpire: validateField("tetanusExpire", formData.tetanusExpire),
            westNileExpire: validateField("westNileExpire", formData.westNileExpire),
            eeWeeExpire: validateField("eeWeeExpire", formData.eeWeeExpire),
            fluRhinoExpire: validateField("fluRhinoExpire", formData.fluRhinoExpire),

            cogginsExpire: validateField("cogginsExpire", formData.cogginsExpire),
            farrierDue: validateField("farrierDue", formData.farrierDue),
            dentalDue: validateField("dentalDue", formData.dentalDue),
            dewormDue: validateField("dewormDue", formData.dewormDue),

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

            <form onSubmit={handleSubmit}>
                <div className="formInputs">
                    <div className="formNote">
                        Don’t see a medication or supplement? You can add it to inventory after submission and assign it to this horse from the medical profile.
                    </div>

                    <div className="formSection">
                        <h3>Vet Information</h3>

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
                                label={<b>Primary Veterinarian: </b>}
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
                        <h3>Vaccination Records</h3>
                        <div className="inventory-form-row2">
                            <TextField
                                id="rabiesExpire"
                                type="date"
                                className="dateInput"
                                label={<b>Rabies Expiration Date: </b>}
                                value={formData.rabiesExpire}
                                onChange={(value) => updateField("rabiesExpire", value)}
                                icon_label="Rabies expiration help"
                                title="Rabies Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.rabiesExpire ? errors.rabiesExpire : ""}
                                onBlur={() => handleBlur("rabiesExpire", formData.rabiesExpire, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="tetanusExpire"
                                type="date"
                                className="dateInput"
                                label={<b>Tetanus Expiration Date: </b>}
                                value={formData.tetanusExpire}
                                onChange={(value) => updateField("tetanusExpire", value)}
                                icon_label="Tetanus expiration help"
                                title="Tetanus Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.tetanusExpire ? errors.tetanusExpire : ""}
                                onBlur={() => handleBlur("tetanusExpire", formData.tetanusExpire, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="westNileExpire"
                                type="date"
                                className="dateInput"
                                label={<b>West Nile Expiration Date: </b>}
                                value={formData.westNileExpire}
                                onChange={(value) => updateField("westNileExpire", value)}
                                icon_label="West Nile expiration help"
                                title="West Nile Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.westNileExpire ? errors.westNileExpire : ""}
                                onBlur={() => handleBlur("westNileExpire", formData.westNileExpire, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="eeeWeeExpire"
                                type="date "
                                className="dateInput"
                                label={<b>EEE/WEE Expiration Date: </b>}
                                value={formData.eeeWeeExpire}
                                onChange={(value) => updateField("eeeWeeExpire", value)}
                                icon_label="EEE/WEE expiration help"
                                title="EEE/WEE Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.eeeWeeExpire ? errors.eeeWeeExpire : ""}
                                onBlur={() => handleBlur("eeeWeeExpire", formData.eeeWeeExpire, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="fluRhinoExpire"
                                type="date"
                                className="dateInput"
                                label={<b>Flu/Rhino Expiration Date: </b>}
                                value={formData.fluRhinoExpire}
                                onChange={(value) => updateField("fluRhinoExpire", value)}
                                icon_label="Flu/Rhino expiration help"
                                title="Flu/Rhino Expiration Date"
                                body="Enter the expiration date if this vaccine has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.fluRhinoExpire ? errors.fluRhinoExpire : ""}
                                onBlur={() => handleBlur("fluRhinoExpire", formData.fluRhinoExpire, setTouched, setErrors, validateField)}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Preventative Care</h3>
                        <div className="inventory-form-row2">
                            <TextField
                                id="cogginsExpire"
                                type="date"
                                className="dateInput"
                                label={<b>Coggins Test Expiration Date: </b>}
                                value={formData.cogginsExpire}
                                onChange={(value) => updateField("cogginsExpire", value)}
                                icon_label="Coggins Test help"
                                title="Coggins Test Expiration Date"
                                body="Enter the expiration date if this test has been administered. Dates may be entered even if expired to maintain accurate medical history."
                                isRequired={false}
                                error={touched.cogginsExpire ? errors.cogginsExpire : ""}
                                onBlur={() => handleBlur("cogginsExpire", formData.cogginsExpire, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="farrierDue"
                                type="date"
                                className="dateInput"
                                label={<b>Last Farrier Visit Date: </b>}
                                value={formData.farrierDue}
                                onChange={(value) => updateField("farrierDue", value)}
                                icon_label="Farrier visit help"
                                title="Farrier Last Visit Date"
                                body="Enter the date the horse was last seen by the farrier. This helps track hoof care schedules."
                                isRequired={false}
                                error={touched.farrierDue ? errors.farrierDue : ""}
                                onBlur={() => handleBlur("farrierDue", formData.farrierDue, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="dentalDue"
                                type="date"
                                className="dateInput"
                                label={<b>Last Dental Exam Date: </b>}
                                value={formData.dentalDue}
                                onChange={(value) => updateField("dentalDue", value)}
                                icon_label="Dental exam date help"
                                title="Last Dental Exam Date"
                                body="Enter the date the horse last received a dental exam. Dates may be entered even if only an estimate to maintain accurate medical history."
                                isRequired={false}
                                error={touched.dentalDue ? errors.dentalDue : ""}
                                onBlur={() => handleBlur("dentalDue", formData.dentalDue, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="dewormDue"
                                type="date"
                                className="dateInput"
                                label={<b>Last Deworming Date: </b>}
                                value={formData.dewormDue}
                                onChange={(value) => updateField("dewormDue", value)}
                                icon_label="Deworming date help"
                                title="Last Deworming Date"
                                body="Enter the date the horse was last dewormed. This helps track parasite management history.."
                                isRequired={false}
                                error={touched.dewormDue ? errors.dewormDue : ""}
                                onBlur={() => handleBlur("dewormDue", formData.dewormDue, setTouched, setErrors, validateField)}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Medical History</h3>
                        <div className="inventory-form-row4">
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
                            touched={touched.notes}
                        />
                        </div>
                    </div>

                    <div className="formSection">

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
                            tipPmTitle="PM Checkboc"
                            tipPmBody="Check if medication is given in the evening."
                            tipNotesTitle="Medication Notes"
                            tipNotesBody="Add any additional notes that may be helpful to give the best care tailored to the horse."
                        />
                    </div>

                        <div className="formSection">
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

                            <div className="formButton">
                                <Button label="Next" type="submit"/>
                            </div>
                     </div>
                </div>
            </form>
        </div>
    );
}

export default MedicalForm;