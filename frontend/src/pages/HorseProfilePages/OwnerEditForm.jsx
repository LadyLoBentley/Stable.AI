import { useEffect, useState } from "react";

import TextField from "../../components/Form/TextField.jsx";
import DropdownField from "../../components/Form/DropdownField.jsx";
import CheckboxField from "../../components/Form/Checkbox.jsx";

import { readErrorMessage } from "./profileFormUtils.js";

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

const RELATIONS = [
    "Father",
    "Mother",
    "Spouse",
    "Partner",
    "Sibling",
    "Friend",
    "Relative",
    "Other"
];

function buildInitialState(owner) {
    return {
        ownerName: owner.owner_name || "",
        ownerPhone: owner.owner_phone || "",
        ownerEmail: owner.owner_email || "",
        emergencyContactName: owner.emergency_contact_name || "",
        emergencyContactRelations: owner.emergency_contact_relation || "",
        emergencyContactPhone: owner.emergency_contact_phone || "",
        streetAddress: owner.street_address || "",
        aptNo: owner.apt_no || "",
        city: owner.city || "",
        state: owner.state || "",
        zip: owner.zip || "",
        signedWaiver: Boolean(owner.signed_waiver)
    };
}

function OwnerEditForm({ owner, onSaved, onCancel }) {
    const [formData, setFormData] = useState(() => buildInitialState(owner));
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    useEffect(() => {
        setFormData(buildInitialState(owner));
        setErrors({});
        setSubmitStatus({ type: "", message: "" });
    }, [owner]);

    function updateField(fieldName, value) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    }

    function validateForm() {
        const nextErrors = {};

        if (!formData.ownerName.trim()) {
            nextErrors.ownerName = "Owner name is required.";
        }

        if (!formData.ownerPhone.trim()) {
            nextErrors.ownerPhone = "Owner phone is required.";
        }

        if (!formData.ownerEmail.trim()) {
            nextErrors.ownerEmail = "Owner email is required.";
        }

        if (!formData.emergencyContactName.trim()) {
            nextErrors.emergencyContactName = "Emergency contact name is required.";
        }

        if (!formData.emergencyContactRelations.trim()) {
            nextErrors.emergencyContactRelations = "Emergency contact relation is required.";
        }

        if (!formData.emergencyContactPhone.trim()) {
            nextErrors.emergencyContactPhone = "Emergency contact phone is required.";
        }

        if (!formData.streetAddress.trim()) {
            nextErrors.streetAddress = "Street address is required.";
        }

        if (!formData.city.trim()) {
            nextErrors.city = "City is required.";
        }

        if (!formData.state.trim()) {
            nextErrors.state = "State is required.";
        }

        if (!formData.zip.trim()) {
            nextErrors.zip = "Zip code is required.";
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
                message: "Please fix the highlighted owner fields before saving."
            });
            return;
        }

        setSubmitStatus({ type: "", message: "" });

        try {
            const payload = new FormData();
            payload.append("ownerName", formData.ownerName);
            payload.append("ownerPhone", formData.ownerPhone);
            payload.append("ownerEmail", formData.ownerEmail);
            payload.append("emergencyContactName", formData.emergencyContactName);
            payload.append("emergencyContactRelations", formData.emergencyContactRelations);
            payload.append("emergencyContactPhone", formData.emergencyContactPhone);
            payload.append("streetAddress", formData.streetAddress);
            payload.append("aptNo", formData.aptNo);
            payload.append("city", formData.city);
            payload.append("state", formData.state);
            payload.append("zip", formData.zip);
            payload.append("signedWaiver", String(formData.signedWaiver));

            const response = await fetch(`http://127.0.0.1:8002/api/owner/${owner.owner_id}`, {
                method: "PUT",
                body: payload
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to update owner information."));
            }

            const data = await response.json();
            onSaved(data);
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to update owner information."
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

            <div className="formSection">
                <h3>Edit Owner Information</h3>
                <div className="inventory-form-row1">
                    <TextField
                        id="edit-ownerName"
                        label={<b>Name: </b>}
                        value={formData.ownerName}
                        onChange={(value) => updateField("ownerName", value)}
                        isRequired={true}
                        error={errors.ownerName || ""}
                    />

                    <TextField
                        id="edit-ownerPhone"
                        label={<b>Phone Number: </b>}
                        value={formData.ownerPhone}
                        onChange={(value) => updateField("ownerPhone", value)}
                        isRequired={true}
                        error={errors.ownerPhone || ""}
                    />

                    <TextField
                        id="edit-ownerEmail"
                        label={<b>Email Address: </b>}
                        value={formData.ownerEmail}
                        onChange={(value) => updateField("ownerEmail", value)}
                        isRequired={true}
                        error={errors.ownerEmail || ""}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Address</h3>
                <div className="inventory-form-row2">
                    <TextField
                        id="edit-streetAddress"
                        label={<b>Street Address: </b>}
                        value={formData.streetAddress}
                        onChange={(value) => updateField("streetAddress", value)}
                        isRequired={true}
                        error={errors.streetAddress || ""}
                    />

                    <TextField
                        id="edit-aptNo"
                        label={<b>Apt. No: </b>}
                        value={formData.aptNo}
                        onChange={(value) => updateField("aptNo", value)}
                    />
                </div>

                <div className="inventory-form-row1">
                    <TextField
                        id="edit-city"
                        label={<b>City: </b>}
                        value={formData.city}
                        onChange={(value) => updateField("city", value)}
                        isRequired={true}
                        error={errors.city || ""}
                    />

                    <DropdownField
                        id="edit-state"
                        label={<b>State: </b>}
                        options={US_STATES}
                        value={formData.state}
                        onChange={(value) => updateField("state", value)}
                        allowCustom={false}
                        isRequired={true}
                        error={errors.state || ""}
                    />

                    <TextField
                        id="edit-zip"
                        label={<b>Zipcode: </b>}
                        value={formData.zip}
                        onChange={(value) => updateField("zip", value)}
                        isRequired={true}
                        error={errors.zip || ""}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Emergency Contact</h3>
                <div className="inventory-form-row1">
                    <TextField
                        id="edit-emergencyContactName"
                        label={<b>Name: </b>}
                        value={formData.emergencyContactName}
                        onChange={(value) => updateField("emergencyContactName", value)}
                        isRequired={true}
                        error={errors.emergencyContactName || ""}
                    />

                    <DropdownField
                        id="edit-emergencyContactRelations"
                        label={<b>Relation: </b>}
                        options={RELATIONS}
                        value={formData.emergencyContactRelations}
                        onChange={(value) => updateField("emergencyContactRelations", value)}
                        allowCustom={false}
                        isRequired={true}
                        error={errors.emergencyContactRelations || ""}
                    />

                    <TextField
                        id="edit-emergencyContactPhone"
                        label={<b>Phone Number: </b>}
                        value={formData.emergencyContactPhone}
                        onChange={(value) => updateField("emergencyContactPhone", value)}
                        isRequired={true}
                        error={errors.emergencyContactPhone || ""}
                    />
                </div>

                <div className="inventory-form-row3">
                    <CheckboxField
                        id="edit-signedWaiver"
                        label="Signed liability waiver on file"
                        checked={formData.signedWaiver}
                        onChange={(value) => updateField("signedWaiver", value)}
                    />
                </div>
            </div>

            <div className="profileActionRow">
                <button type="button" className="profileActionButton secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="profileActionButton">
                    Save Owner Information
                </button>
            </div>
        </form>
    );
}

export default OwnerEditForm;
