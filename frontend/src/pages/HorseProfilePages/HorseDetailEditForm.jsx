import { useEffect, useState } from "react";

import TextField from "../../components/Form/TextField.jsx";
import DropdownField from "../../components/Form/DropdownField.jsx";
import Toggle from "../../components/Form/Toggle.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import UploadImage from "../../components/Form/UploadImage.jsx";
import NumberField from "../../components/Form/NumberField.jsx";
import CheckboxField from "../../components/Form/Checkbox.jsx";

import { toDateInputValue, readErrorMessage } from "./profileFormUtils.js";

const SEX_OPTIONS = ["Mare", "Gelding", "Stallion"];
const STALL_TURNOUT_OPTIONS = [
    "Group Turnout",
    "Small Group Turnout",
    "Mares only",
    "Geldings only",
    "Individual Paddock",
    "Medical Turnout",
    "Flexible"
];
const PASTURE_TURNOUT_OPTIONS = [
    "Must live alone",
    "Needs a buddy",
    "Group pasture OK",
    "Flexible"
];

function buildInitialState(horse) {
    return {
        horseName: horse.horse_name || "",
        breed: horse.breed || "",
        sex: horse.sex || "",
        birthdate: toDateInputValue(horse.birthdate),
        height: horse.height ?? "",
        weight: horse.weight ?? "",

        locationType: horse.location_type || (horse.barn ? "stall" : "pasture"),
        turnoutType: horse.turnout_type || "",
        pastureName: horse.pasture_name || "",
        barn: horse.barn || "",
        stallId: horse.stall_id || "",

        escapeRisk: Boolean(horse.escape_risk),
        mayBite: Boolean(horse.may_bite),
        mayKick: Boolean(horse.may_kick),
        difficultToCatch: Boolean(horse.difficult_to_catch),
        herdDominant: Boolean(horse.herd_dominant),
        sedationRequired: Boolean(horse.sedation_required),
        foodAggressive: Boolean(horse.food_aggressive),
        requiresExperiencedHandler: Boolean(horse.requires_experienced_handler),

        temperament: horse.temperament || "",
        notes: horse.notes || ""
    };
}

function HorseDetailEditForm({ horse, onSaved, onCancel }) {
    const [formData, setFormData] = useState(() => buildInitialState(horse));
    const [imageFile, setImageFile] = useState(null);
    const [breeds, setBreeds] = useState([]);
    const [barns, setBarns] = useState([]);
    const [pastures, setPastures] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    useEffect(() => {
        setFormData(buildInitialState(horse));
        setImageFile(null);
        setErrors({});
        setSubmitStatus({ type: "", message: "" });
    }, [horse]);

    useEffect(() => {
        async function fetchOptions() {
            try {
                setLoadingOptions(true);

                const [breedResponse, barnResponse, pastureResponse] = await Promise.all([
                    fetch("http://127.0.0.1:8002/api/breed/"),
                    fetch("http://127.0.0.1:8002/api/barn/"),
                    fetch("http://127.0.0.1:8002/api/pastures/")
                ]);

                const [breedData, barnData, pastureData] = await Promise.all([
                    breedResponse.json(),
                    barnResponse.json(),
                    pastureResponse.json()
                ]);

                setBreeds(Array.isArray(breedData) ? breedData.map((breed) => breed.name) : []);
                setBarns(Array.isArray(barnData) ? barnData.map((barn) => barn.name) : []);
                setPastures(Array.isArray(pastureData) ? pastureData.map((pasture) => pasture.name) : []);
            } catch (error) {
                setSubmitStatus({
                    type: "error",
                    message: error.message || "Failed to load horse form options."
                });
            } finally {
                setLoadingOptions(false);
            }
        }

        fetchOptions();
    }, []);

    function updateField(fieldName, value) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    }

    function handleLocationTypeChange(value) {
        setFormData((prev) => ({
            ...prev,
            locationType: value,
            barn: value === "stall" ? prev.barn : "",
            stallId: value === "stall" ? prev.stallId : "",
            pastureName: value === "pasture" ? prev.pastureName : prev.pastureName
        }));
    }

    function validateForm() {
        const nextErrors = {};

        if (!formData.horseName.trim()) {
            nextErrors.horseName = "Horse name is required.";
        }

        if (!formData.breed.trim()) {
            nextErrors.breed = "Breed is required.";
        }

        if (!formData.sex.trim()) {
            nextErrors.sex = "Sex is required.";
        }

        if (!formData.birthdate) {
            nextErrors.birthdate = "Birthdate is required.";
        }

        if (formData.height === "" || Number(formData.height) <= 0) {
            nextErrors.height = "Height must be greater than 0.";
        }

        if (formData.locationType === "stall") {
            if (!formData.barn.trim()) {
                nextErrors.barn = "Barn is required for a stalled horse.";
            }

            if (!formData.stallId.trim()) {
                nextErrors.stallId = "Stall ID is required.";
            }
        }

        if (formData.locationType === "pasture" && !formData.pastureName.trim()) {
            nextErrors.pastureName = "Pasture is required for a horse living in pasture.";
        }

        if (!formData.turnoutType.trim()) {
            nextErrors.turnoutType = "Turnout type is required.";
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
                message: "Please fix the highlighted horse fields before saving."
            });
            return;
        }

        setSubmitStatus({ type: "", message: "" });

        try {
            const payload = new FormData();
            payload.append("horseName", formData.horseName);
            payload.append("ownerName", horse.owner_name || "");
            payload.append("breed", formData.breed);
            payload.append("sex", formData.sex);
            payload.append("birthdate", formData.birthdate);
            payload.append("height", String(formData.height));
            payload.append("weight", formData.weight === "" ? "" : String(formData.weight));

            payload.append("locationType", formData.locationType);
            payload.append("turnoutType", formData.turnoutType);
            payload.append("barn", formData.locationType === "stall" ? formData.barn : "");
            payload.append("stallId", formData.locationType === "stall" ? formData.stallId : "");
            payload.append("pastureName", formData.pastureName || "");

            payload.append("escapeRisk", String(formData.escapeRisk));
            payload.append("mayBite", String(formData.mayBite));
            payload.append("mayKick", String(formData.mayKick));
            payload.append("difficultToCatch", String(formData.difficultToCatch));
            payload.append("herdDominant", String(formData.herdDominant));
            payload.append("sedationRequired", String(formData.sedationRequired));
            payload.append("foodAggressive", String(formData.foodAggressive));
            payload.append("requiresExperiencedHandler", String(formData.requiresExperiencedHandler));

            payload.append("temperament", formData.temperament);
            payload.append("notes", formData.notes);

            if (imageFile) {
                payload.append("image", imageFile);
            }

            const response = await fetch(`http://127.0.0.1:8002/api/horses/${horse.horse_id}`, {
                method: "PUT",
                body: payload
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to update horse details."));
            }

            const data = await response.json();
            onSaved(data);
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to update horse details."
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

            {loadingOptions && <div className="formAlert">Loading horse form options...</div>}

            <div className="formSection">
                <h3>Edit Horse Details</h3>
                <div className="inventory-form-row2">
                    <TextField
                        id="edit-horseName"
                        label={<b>Horse Name: </b>}
                        value={formData.horseName}
                        onChange={(value) => updateField("horseName", value)}
                        isRequired={true}
                        error={errors.horseName || ""}
                    />

                    <TextField
                        id="edit-birthdate"
                        type="date"
                        label={<b>Birthday: </b>}
                        value={formData.birthdate}
                        onChange={(value) => updateField("birthdate", value)}
                        isRequired={true}
                        error={errors.birthdate || ""}
                    />
                </div>

                <div className="inventory-form-row2">
                    <DropdownField
                        id="edit-sex"
                        label={<b>Sex: </b>}
                        options={SEX_OPTIONS}
                        value={formData.sex}
                        onChange={(value) => updateField("sex", value)}
                        allowCustom={false}
                        isRequired={true}
                        error={errors.sex || ""}
                    />

                    <DropdownField
                        id="edit-breed"
                        label={<b>Breed: </b>}
                        options={breeds}
                        value={formData.breed}
                        onChange={(value) => updateField("breed", value)}
                        allowCustom={false}
                        isRequired={true}
                        error={errors.breed || ""}
                    />

                    <NumberField
                        id="edit-height"
                        label={<b>Height (hands): </b>}
                        value={formData.height}
                        onChange={(value) => updateField("height", value)}
                        isRequired={true}
                        error={errors.height || ""}
                    />

                    <NumberField
                        id="edit-weight"
                        label={<b>Weight (lbs): </b>}
                        value={formData.weight}
                        onChange={(value) => updateField("weight", value)}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Location</h3>
                <div className="inventory-form-row3">
                    <Toggle
                        value={formData.locationType}
                        onChange={handleLocationTypeChange}
                        error={errors.locationType || ""}
                    />
                </div>

                {formData.locationType === "stall" ? (
                    <div className="inventory-form-row2">
                        <DropdownField
                            id="edit-barn"
                            label={<b>Barn Name: </b>}
                            options={barns}
                            value={formData.barn}
                            onChange={(value) => updateField("barn", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.barn || ""}
                        />

                        <TextField
                            id="edit-stallId"
                            label={<b>Stall ID: </b>}
                            value={formData.stallId}
                            onChange={(value) => updateField("stallId", value)}
                            isRequired={true}
                            error={errors.stallId || ""}
                        />

                        <DropdownField
                            id="edit-stall-turnoutType"
                            label={<b>Turnout Type: </b>}
                            options={STALL_TURNOUT_OPTIONS}
                            value={formData.turnoutType}
                            onChange={(value) => updateField("turnoutType", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.turnoutType || ""}
                        />

                        <DropdownField
                            id="edit-turnout-pasture"
                            label={<b>Turnout Pasture: </b>}
                            options={pastures}
                            value={formData.pastureName}
                            onChange={(value) => updateField("pastureName", value)}
                            allowCustom={false}
                        />
                    </div>
                ) : (
                    <div className="inventory-form-row2">
                        <DropdownField
                            id="edit-pastureName"
                            label={<b>Pasture Name: </b>}
                            options={pastures}
                            value={formData.pastureName}
                            onChange={(value) => updateField("pastureName", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.pastureName || ""}
                        />

                        <DropdownField
                            id="edit-pasture-turnoutType"
                            label={<b>Pasture Compatibility: </b>}
                            options={PASTURE_TURNOUT_OPTIONS}
                            value={formData.turnoutType}
                            onChange={(value) => updateField("turnoutType", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.turnoutType || ""}
                        />
                    </div>
                )}
            </div>

            <div className="formSection">
                <h3>Edit Safety Flags</h3>
                <div className="checkboxGrid">
                    <CheckboxField
                        id="edit-escapeRisk"
                        label="Escape Risk"
                        checked={formData.escapeRisk}
                        onChange={(value) => updateField("escapeRisk", value)}
                    />
                    <CheckboxField
                        id="edit-mayBite"
                        label="May Bite"
                        checked={formData.mayBite}
                        onChange={(value) => updateField("mayBite", value)}
                    />
                    <CheckboxField
                        id="edit-mayKick"
                        label="May Kick"
                        checked={formData.mayKick}
                        onChange={(value) => updateField("mayKick", value)}
                    />
                    <CheckboxField
                        id="edit-difficultToCatch"
                        label="Difficult To Catch"
                        checked={formData.difficultToCatch}
                        onChange={(value) => updateField("difficultToCatch", value)}
                    />
                    <CheckboxField
                        id="edit-herdDominant"
                        label="Dominant In Herd"
                        checked={formData.herdDominant}
                        onChange={(value) => updateField("herdDominant", value)}
                    />
                    <CheckboxField
                        id="edit-sedationRequired"
                        label="Sedation Required"
                        checked={formData.sedationRequired}
                        onChange={(value) => updateField("sedationRequired", value)}
                    />
                    <CheckboxField
                        id="edit-foodAggressive"
                        label="Food Aggressive"
                        checked={formData.foodAggressive}
                        onChange={(value) => updateField("foodAggressive", value)}
                    />
                    <CheckboxField
                        id="edit-requiresExperiencedHandler"
                        label="Requires Experienced Handler"
                        checked={formData.requiresExperiencedHandler}
                        onChange={(value) => updateField("requiresExperiencedHandler", value)}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Edit Notes</h3>
                <div className="inventory-form-row3">
                    <TextAreaField
                        id="edit-temperament"
                        label={<b>Behavior Notes: </b>}
                        value={formData.temperament}
                        onChange={(value) => updateField("temperament", value)}
                        maxLength={1000}
                    />

                    <TextAreaField
                        id="edit-notes"
                        label={<b>Special Care Requests: </b>}
                        value={formData.notes}
                        onChange={(value) => updateField("notes", value)}
                        maxLength={1000}
                    />
                </div>
            </div>

            <div className="formSection">
                <h3>Replace Image</h3>

                {horse.image && (
                    <div className="existingAssetPreview">
                        <img src={horse.image} alt={horse.horse_name} className="existingAssetImage" />
                    </div>
                )}

                <div className="inventory-form-row4">
                    <UploadImage
                        id="edit-horse-image"
                        label={<b>New Image (Optional): </b>}
                        value={imageFile}
                        onChange={setImageFile}
                        maxSizeMB={5}
                    />
                </div>
            </div>

            <div className="profileActionRow">
                <button type="button" className="profileActionButton secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="profileActionButton">
                    Save Horse Details
                </button>
            </div>
        </form>
    );
}

export default HorseDetailEditForm;
