import { useState, useEffect } from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {handleBlur} from "../../utils/FormUtil.js";
import TextField from "../../components/Form/TextField.jsx";
import DropdownField from "../../components/Form/DropdownField.jsx";
import CheckboxField from "../../components/Form/CheckBox.jsx";
import Button from "../../components/Button/Button.jsx";

const US_STATES = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
];

const relations = [
    "Father",
    "Mother",
    "Spouse",
    "Partner",
    "Sibling",
    "Friend",
    "Relative",
    "Other"
]

function OwnerForm() {
    const { formData, setFormData, resetFormData } = useOutletContext();
    const navigate = useNavigate();


    const [touched, setTouched] = useState({
        ownerName: false,
        ownerPhone: false,
        ownerEmail: false,

        emergencyContactName: false,
        emergencyContactRelations: false,
        emergencyContactPhone: false,

        streetAddress: false,
        aptNo: false,
        city: false,
        state: false,
        zip: false,

        signedWaiver: false,
    });

    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    const [errors, setErrors] = useState({});

    function validateField(name, value) {
        switch (name) {
            case "ownerName":
                if (!value?.trim()) return "Owner name is required.";
                return "";

            case "ownerPhone":
                if (!value?.trim()) return "Owner's phone number is required.";
                return "";

            case "ownerEmail":
                if (!value?.trim()) return "Owner's email address is required.";
                return "";

            case "emergencyContactName":
                if (!value?.trim()) return "Name of emergency contact is required.";
                return "";

            case "emergencyContactRelations":
                 if (!value?.trim()) return "Relation to emergency contact is required.";
                 return "";

            case "emergencyContactPhone":
                  if (!value?.trim()) return "Emergency contact's phone number is required.";
                  return "";

            case "streetAddress":
                if (!value?.trim()) return "Street address is required.";
                return "";

            case "city":
                if (!value?.trim()) return "City is required.";
                return "";

            case "state":
                if (!value?.trim()) return "State is required.";
                return "";

            case "zip":
                if (!value?.trim()) return "Zipcode is required.";
                return "";

            case "signedWaiver":
                if (!value) return "Waiver is required.";
                return "";

            default:
                return "";
        }
    }

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
            ownerName: true,
            ownerPhone: true,
            ownerEmail: true,

            emergencyContactName: true,
            emergencyContactRelations: true,
            emergencyContactPhone: true,

            streetAddress: true,
            aptNo: true,
            city: true,
            state: true,
            zip: true,

            signedWaiver: true
        };

        setTouched(newTouched);

        const newErrors = {
            ownerName: validateField("ownerName", formData.ownerName),
            ownerPhone: validateField("ownerPhone", formData.ownerPhone),
            ownerEmail: validateField("ownerEmail", formData.ownerEmail),

            emergencyContactName: validateField("emergencyContactName", formData.emergencyContactName),
            emergencyContactRelations: validateField("emergencyContactRelations", formData.emergencyContactRelations),
            emergencyContactPhone: validateField("emergencyContactPhone", formData.emergencyContactPhone),

            streetAddress: validateField("streetAddress", formData.streetAddress),
            aptNo: validateField("aptNo", formData.aptNo),
            city: validateField("city", formData.city),
            state: validateField("state", formData.state),
            zip: validateField("zip", formData.zip),

            signedWaiver: validateField("signedWaiver", formData.signedWaiver)
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

        setSubmitStatus({
            type: "",
            message: ""
        });

        try {
            // 1. OWNER
            const ownerPayload = new FormData();
    ownerPayload.append("ownerName", formData.ownerName);
    ownerPayload.append("ownerPhone", formData.ownerPhone);
    ownerPayload.append("ownerEmail", formData.ownerEmail);

    ownerPayload.append("emergencyContactName", formData.emergencyContactName);
    ownerPayload.append("emergencyContactRelations", formData.emergencyContactRelations);
    ownerPayload.append("emergencyContactPhone", formData.emergencyContactPhone);

    ownerPayload.append("streetAddress", formData.streetAddress);
    ownerPayload.append("aptNo", formData.aptNo || "");
    ownerPayload.append("city", formData.city);
    ownerPayload.append("state", formData.state);
    ownerPayload.append("zip", formData.zip);

    ownerPayload.append("signedWaiver", String(formData.signedWaiver));

    const ownerResponse = await fetch("http://localhost:8002/api/owner/", {
        method: "POST",
        body: ownerPayload
    });

            if (!ownerResponse.ok) {
                const errorData = await ownerResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to save owner information.");
            }

            // 2. HORSE
            const horsePayload = new FormData();
            horsePayload.append("horseName", formData.horseName);
            horsePayload.append("ownerName", formData.ownerName);
            horsePayload.append("breed", formData.breed);
            horsePayload.append("sex", formData.sex);
            horsePayload.append("birthdate", formData.birthdate);
            horsePayload.append("height", formData.height);
            horsePayload.append("weight", formData.weight);

            horsePayload.append("locationType", String(formData.locationType));
            horsePayload.append("turnoutType", String(formData.turnoutType));
            horsePayload.append("barn", formData.barn || "");
            horsePayload.append("stallId", formData.stallId || "");
            horsePayload.append("pastureName", formData.pastureName || "");

            horsePayload.append("escapeRisk", formData.escapeRisk);
            horsePayload.append("mayBite", formData.mayBite);
            horsePayload.append("mayKick", formData.mayKick);
            horsePayload.append("difficultToCatch", formData.difficultToCatch);
            horsePayload.append("herdDominant", formData.herdDominant);
            horsePayload.append("sedationRequired", formData.sedationRequired);
            horsePayload.append("foodAggressive",formData.foodAggressive);
            horsePayload.append("requiresExperiencedHandler", formData.requiresExperiencedHandler);

            horsePayload.append("temperament", formData.temperament);
            horsePayload.append("notes", formData.notes || "");
            horsePayload.append("image", formData.image);

            const horseResponse = await fetch("http://localhost:8002/api/horses/", {
                method: "POST",
                body: horsePayload
            });

            if (!horseResponse.ok) {
                const errorData = await horseResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to save horse information.");
            }

            // 3. MEDICAL
            const medicalPayload = {
                horseName: formData.horseName,
                birthdate: formData.birthdate,

                vetClinic: formData.vetClinic,
                vetName: formData.vetName,
                vetPhone: formData.vetPhone,

                isSameVet: formData.isSameVet,
                emergencyClinic: formData.emergencyClinic || null,
                emergencyVetName: formData.emergencyVetName || null,
                emergencyVetPhone: formData.emergencyVetPhone || null,
                emergencyAuthorization: formData.emergencyAuthorization,
                emergencyInstructions: formData.emergencyInstructions,

                rabiesExpiration: formData.rabiesExpiration || null,
                tetanusExpiration: formData.tetanusExpiration || null,
                westNileExpiration: formData.westNileExpiration || null,
                eeeWeeExpiration: formData.eeeWeeExpiration || null,
                fluRhinoExpiration: formData.fluRhinoExpiration || null,
                cogginsExpiration: formData.cogginsExpiration || null,

                hasShoes: formData.hasShoes,
                farrierName: formData.farrierName || null,
                farrierDate: formData.farrierDate || null,
                farrierPhone: formData.farrierPhone || null,
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

                allergies: formData.allergies || [],
                medicalConditions: formData.medicalConditions || [],
                medications: formData.medications || [],
                supplements: formData.supplements || [],

                medicalNotes: formData.medicalNotes || null
            };


            const medicalResponse = await fetch("http://localhost:8002/api/medical_records/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(medicalPayload)
            });

            if (!medicalResponse.ok) {
                const errorData = await medicalResponse.json().catch(() => ({}));
                console.error("Medical API error:", errorData);
                throw new Error(
                    errorData.detail
                        ? JSON.stringify(errorData.detail, null, 2)
                        : "Failed to save medical information."
                );
            }

            // 4. FEED
            const feedPayload = {
                horseName: formData.horseName,
                birthdate: formData.birthdate,

                feedHay: formData.feedHay,
                hayType: formData.hayType || null,
                hayAmount: formData.hayAmount === "" ? null : Number(formData.hayAmount),
                hayReplacement: formData.hayReplacement || null,
                replacementAmount: formData.replacementAmount === "" ? null : Number(formData.replacementAmount),
                replacementUnit: formData.replacementUnit || null,

                grainType: formData.grainType,
                grainAmount: formData.grainAmount === "" ? null : Number(formData.grainAmount),
                grainUnit: formData.grainUnit || null,
                addFoodAdditive: formData.addFoodAdditive,
                foodAdditive: formData.foodAdditive || null,
                additiveAmount: formData.additiveAmount === "" ? null : Number(formData.additiveAmount),
                additiveUnit: formData.additiveUnit || null,

                mustSeparate: formData.mustSeparate,
                soakFeed: formData.soakFeed,
                hayNet: formData.hayNet,
                feedingInstructions: formData.feedingInstructions || null
            };

            const feedResponse = await fetch("http://localhost:8002/api/feed/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(feedPayload)
            });

            if (!feedResponse.ok) {
                const errorData = await feedResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to save feeding information.");
            }

            setSubmitStatus({
             type:"success",
             message:"Horse profile submitted successfully."
            });

            setTimeout(() => {
             resetFormData();
             setErrors({});
             setTouched({});
            }, 800);

            resetFormData();

            setErrors({});
                setTouched({
                    ownerName: false,
                    ownerPhone: false,
                    ownerEmail: false,

                    emergencyContactName: false,
                    emergencyContactRelations: false,
                    emergencyContactPhone: false,

                    streetAddress: false,
                    aptNo: false,
                    city: false,
                    state: false,
                    zip: false,

                    signedWaiver: false,
                });

        } catch (error) {
            console.error("Final submission error:", error);
            setSubmitStatus({
                type: "error",
                message: error.message || "Submission failed."
            });
        }
    }

    return (
        <div className="formContainer">
            <h2>Owner Information</h2>

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

            <form onSubmit={handleSubmit}>
                <div className="formInputs">
                    <div className="formSection">
                        <h3>Owner Details</h3>
                        <div className="inventory-form-row1">
                            <TextField
                                id="ownerName"
                                label={<b>Name: </b>}
                                placeholder="John Doe"
                                value={formData.ownerName}
                                onChange={(value) => updateField("ownerName", value)}
                                isRequired={true}
                                error={touched.ownerName ? errors.ownerName : ""}
                                onBlur={() => handleBlur("ownerName", formData.ownerName, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="ownerPhone"
                                label={<b>Phone Number: </b>}
                                placeholder="Format: (555) 555-5555"
                                value={formData.ownerPhone}
                                onChange={(value) => updateField("ownerPhone", value)}
                                isRequired={true}
                                title="Phone Number"
                                body="Please enter phone number in format: (843) 456-7890. Do not forget the area code."
                                error={touched.ownerPhone ? errors.ownerPhone : ""}
                                onBlur={() => handleBlur("ownerPhone", formData.ownerPhone, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="ownerEmail"
                                label={<b>Email Address: </b>}
                                placeholder="Format: youremail@gmail.com"
                                value={formData.ownerEmail}
                                onChange={(value) => updateField("ownerEmail", value)}
                                isRequired={true}
                                error={touched.ownerEmail ? errors.ownerEmail : ""}
                                onBlur={() => handleBlur("ownerEmail", formData.ownerEmail, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <div className="inventory-form-row2">
                            <TextField
                                id="streetAddress"
                                label={<b>Street Address: </b>}
                                placeholder="youremail@gmail.com"
                                value={formData.streetAddress}
                                onChange={(value) => updateField("streetAddress", value)}
                                isRequired={true}
                                error={touched.streetAddress ? errors.streetAddress : ""}
                                onBlur={() => handleBlur("streetAddress", formData.streetAddress, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="aptNo"
                                label={<b>Apartment Number: </b>}
                                placeholder="Enter apartment number if applicable"
                                value={formData.aptNo}
                                onChange={(value) => updateField("aptNo", value)}
                                isRequired={false}
                                error={touched.aptNo ? errors.aptNo : ""}
                                onBlur={() => handleBlur("aptNo", formData.aptNo, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <div className="inventory-form-row1">
                            <TextField
                                id="city"
                                label={<b>City: </b>}
                                placeholder="Enter City"
                                value={formData.city}
                                onChange={(value) => updateField("city", value)}
                                isRequired={true}
                                error={touched.city ? errors.city : ""}
                                onBlur={() => handleBlur("city", formData.city, setTouched, setErrors, validateField)}
                            />

                            <DropdownField
                                id="state"
                                label={<b>State: </b>}
                                options={US_STATES}
                                value={formData.state}
                                onChange={(value) => updateField("state", value)}
                                allowCustom={false}
                                isRequired={true}
                                error={touched.state ? errors.state : ""}
                                onBlur={() =>
                                    handleBlur("state", formData.state, setTouched, setErrors, validateField)
                                 }
                            />

                            <TextField
                                id="zip"
                                label={<b>Zip code: </b>}
                                placeholder="Enter zip code"
                                value={formData.zip}
                                onChange={(value) => updateField("zip", value)}
                                isRequired={true}
                                error={touched.zip ? errors.zip : ""}
                                onBlur={() => handleBlur("zip", formData.zip, setTouched, setErrors, validateField)}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Emergency Contact</h3>
                        <div className="inventory-form-row1">
                            <TextField
                                id="emergencyContactName"
                                label={<b>Name: </b>}
                                placeholder="Enter name of emergency contact"
                                value={formData.emergencyContactName}
                                onChange={(value) => updateField("emergencyContactName", value)}
                                isRequired={true}
                                error={touched.emergencyContactName ? errors.emergencyContactName : ""}
                                onBlur={() => handleBlur("emergencyContactName", formData.emergencyContactName, setTouched, setErrors, validateField)}
                            />

                           <DropdownField
                                id="emergencyContactRelations"
                                label={<b>Relation: </b>}
                                options={relations}
                                value={formData.emergencyContactRelations}
                                onChange={(value) => updateField("emergencyContactRelations", value)}
                                allowCustom={false}
                                isRequired={true}
                                error={touched.emergencyContactRelations ? errors.emergencyContactRelations : ""}
                                onBlur={() =>
                                    handleBlur("emergencyContactRelations", formData.emergencyContactRelations, setTouched, setErrors, validateField)
                                }
                           />

                            <TextField
                                id="emergencyContactPhone"
                                label={<b>Phone Number: </b>}
                                placeholder="Format: (555) 555-5555"
                                value={formData.emergencyContactPhone}
                                onChange={(value) => updateField("emergencyContactPhone", value)}
                                isRequired={true}
                                title="Emergency Contact's Phone Number"
                                body="Please enter phone number in format: (843) 456-7890. Do not forget the area code."
                                error={touched.emergencyContactPhone ? errors.emergencyContactPhone : ""}
                                onBlur={() => handleBlur("emergencyContactPhone", formData.emergencyContactPhone, setTouched, setErrors, validateField)}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Liability Waiver</h3>
                        <div className="inventory-form-row4">
                            <CheckboxField
                                id="signedWaiver"
                                label="I acknowledge and agree to the Stable.AI liability waiver and equine risk notice."
                                checked={formData.signedWaiver}
                                onChange={(value) => updateField("signedWaiver", value)}
                                title="Liability Waiver"
                                body="I understand that horse boarding, handling, riding, and related equine activities involve inherent risks that may result in injury, illness, property damage, or death. I acknowledge these risks and understand that Stable.AI is a management platform only and does not provide veterinary, legal, medical, or emergency services."
                                isRequired={true}
                                error={touched.signedWaiver && !formData.signedWaiver ? "You must acknowledge the liability waiver." : ""}
                                onBlur={() => setTouched((prev) => ({ ...prev, signedWaiver: true }))}
                            />
                        </div>
                    </div>
                </div>
                <div className="formButton">
                    <Button label="Back" variant="secondary" type="button" onClick={() => navigate(-1)} />
                    <Button label="Submit" type="submit"/>
                </div>
            </form>
        </div>
    );
}

export default OwnerForm;