import { useEffect, useState } from "react";

import CheckboxField from "../../components/Form/Checkbox.jsx";
import DropdownField from "../../components/Form/DropdownField.jsx";
import NumberField from "../../components/Form/NumberField.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import Button from "../../components/Button/Button.jsx";

import { readErrorMessage, toDateInputValue } from "./profileFormUtils.js";

const UNITS = ["scoop", "cup", "oz", "lb", "tbsp", "tsp", "mL"];

function buildInitialState(regime) {
    return {
        feedHay: regime?.feed_hay ?? true,
        hayType: regime?.hay_type || "",
        hayAmount: regime?.hay_amount ?? "",
        hayReplacement: regime?.hay_replacement || "",
        replacementAmount: regime?.replacement_amount ?? "",
        replacementUnit: regime?.replacement_unit || "",

        grainType: regime?.grain_type || "",
        grainAmount: regime?.grain_amount ?? "",
        grainUnit: regime?.grain_unit || "",
        addFoodAdditive: Boolean(regime?.add_food_additive),
        foodAdditive: regime?.food_additive || "",
        additiveAmount: regime?.food_additive_amount ?? "",
        additiveUnit: regime?.additive_unit || "",

        mustSeparate: Boolean(regime?.must_separate),
        soakFeed: Boolean(regime?.soak_feed),
        hayNet: Boolean(regime?.hay_net),
        feedingInstructions: regime?.feeding_instructions || ""
    };
}

function FeedingRegimeEditForm({ horse, regime, onSaved, onCancel }) {
    const [formData, setFormData] = useState(() => buildInitialState(regime));
    const [hayOptions, setHayOptions] = useState([]);
    const [grainOptions, setGrainOptions] = useState([]);
    const [foodAdditiveOptions, setFoodAdditiveOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    useEffect(() => {
        setFormData(buildInitialState(regime));
        setErrors({});
        setSubmitStatus({ type: "", message: "" });
    }, [regime]);

    useEffect(() => {
        async function fetchInventoryOptions() {
            try {
                setLoadingOptions(true);
                const response = await fetch("http://127.0.0.1:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error("Failed to load inventory items for feed editing.");
                }

                const data = await response.json();
                const inventory = Array.isArray(data) ? data : [];

                setHayOptions(inventory.filter((item) => item.category === "Hay").map((item) => item.label));
                setGrainOptions(inventory.filter((item) => item.category === "Grain").map((item) => item.label));
                setFoodAdditiveOptions(
                    inventory.filter((item) => item.category === "Food Additive").map((item) => item.label)
                );
            } catch (error) {
                setSubmitStatus({
                    type: "error",
                    message: error.message || "Failed to load feed options."
                });
            } finally {
                setLoadingOptions(false);
            }
        }

        fetchInventoryOptions();
    }, []);

    function updateField(fieldName, value) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    }

    function handleFeedHayChange(value) {
        setFormData((prev) => ({
            ...prev,
            feedHay: value,
            hayType: value ? prev.hayType : "",
            hayAmount: value ? prev.hayAmount : "",
            hayReplacement: value ? "" : prev.hayReplacement,
            replacementAmount: value ? "" : prev.replacementAmount,
            replacementUnit: value ? "" : prev.replacementUnit
        }));
    }

    function handleFoodAdditiveChange(value) {
        setFormData((prev) => ({
            ...prev,
            addFoodAdditive: value,
            foodAdditive: value ? prev.foodAdditive : "",
            additiveAmount: value ? prev.additiveAmount : "",
            additiveUnit: value ? prev.additiveUnit : ""
        }));
    }

    function validateForm() {
        const nextErrors = {};

        if (formData.feedHay) {
            if (!formData.hayType) {
                nextErrors.hayType = "Hay type is required.";
            }

            if (formData.hayAmount === "" || formData.hayAmount === null) {
                nextErrors.hayAmount = "Hay amount is required.";
            }
        } else {
            if (!formData.hayReplacement) {
                nextErrors.hayReplacement = "Hay replacement is required.";
            }

            if (formData.replacementAmount === "" || formData.replacementAmount === null) {
                nextErrors.replacementAmount = "Replacement amount is required.";
            }

            if (!formData.replacementUnit) {
                nextErrors.replacementUnit = "Replacement unit is required.";
            }
        }

        if (!formData.grainType) {
            nextErrors.grainType = "Grain type is required.";
        }

        if (formData.grainAmount === "" || formData.grainAmount === null) {
            nextErrors.grainAmount = "Grain amount is required.";
        }

        if (!formData.grainUnit) {
            nextErrors.grainUnit = "Grain unit is required.";
        }

        if (formData.addFoodAdditive) {
            if (!formData.foodAdditive) {
                nextErrors.foodAdditive = "Food additive is required.";
            }

            if (formData.additiveAmount === "" || formData.additiveAmount === null) {
                nextErrors.additiveAmount = "Additive amount is required.";
            }

            if (!formData.additiveUnit) {
                nextErrors.additiveUnit = "Additive unit is required.";
            }
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
                message: "Please fix the highlighted feeding fields before saving."
            });
            return;
        }

        setSubmitStatus({ type: "", message: "" });

        try {
            const payload = {
                horseName: horse.horse_name,
                birthdate: toDateInputValue(horse.birthdate),

                feedHay: formData.feedHay,
                hayType: formData.feedHay ? formData.hayType : null,
                hayAmount: formData.feedHay ? Number(formData.hayAmount) : null,
                hayReplacement: formData.feedHay ? null : formData.hayReplacement,
                replacementAmount: formData.feedHay ? null : Number(formData.replacementAmount),
                replacementUnit: formData.feedHay ? null : formData.replacementUnit,

                grainType: formData.grainType,
                grainAmount: Number(formData.grainAmount),
                grainUnit: formData.grainUnit,
                addFoodAdditive: formData.addFoodAdditive,
                foodAdditive: formData.addFoodAdditive ? formData.foodAdditive : null,
                additiveAmount: formData.addFoodAdditive ? Number(formData.additiveAmount) : null,
                additiveUnit: formData.addFoodAdditive ? formData.additiveUnit : null,

                mustSeparate: formData.mustSeparate,
                soakFeed: formData.soakFeed,
                hayNet: formData.hayNet,
                feedingInstructions: formData.feedingInstructions || null
            };

            const response = await fetch(`http://127.0.0.1:8002/api/feed/${horse.horse_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to update feeding regime."));
            }

            const data = await response.json();
            onSaved(data);
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to update feeding regime."
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

            {loadingOptions && <div className="formAlert">Loading feed options...</div>}

            <div className="formInputs">
                <div className="formNote">
                    Feeding decisions must be made based on current horse conditions. If horse is prone to colics and/or choking, please opt in to soaking feed.
                </div>

            <div className="formSection">
                <h3>Select Primary Feed</h3>
                <div className="inventory-form-row3">
                    <CheckboxField
                        id="edit-feedHay"
                        label={<b>Horse is fed hay</b>}
                        checked={formData.feedHay}
                        onChange={handleFeedHayChange}
                    />
                </div>

                {formData.feedHay ? (
                    <div className="inventory-form-row2">
                        <DropdownField
                            id="edit-hayType"
                            label={<b>Select Hay Type: </b>}
                            options={hayOptions}
                            value={formData.hayType}
                            onChange={(value) => updateField("hayType", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.hayType || ""}
                        />

                        <NumberField
                            id="edit-hayAmount"
                            label={<b>Serving Amount (Flakes): </b>}
                            value={formData.hayAmount}
                            onChange={(value) => updateField("hayAmount", value)}
                            isRequired={true}
                            error={errors.hayAmount || ""}
                        />
                    </div>
                ) : (
                    <div className="inventory-form-row1">
                        <DropdownField
                            id="edit-hayReplacement"
                            label={<b>Hay Alternative: </b>}
                            options={foodAdditiveOptions}
                            value={formData.hayReplacement}
                            onChange={(value) => updateField("hayReplacement", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.hayReplacement || ""}
                        />

                        <NumberField
                            id="edit-replacementAmount"
                            label={<b>Serving Amount: </b>}
                            value={formData.replacementAmount}
                            onChange={(value) => updateField("replacementAmount", value)}
                            isRequired={true}
                            error={errors.replacementAmount || ""}
                        />

                        <DropdownField
                            id="edit-replacementUnit"
                            label={<b>Unit: </b>}
                            options={UNITS}
                            value={formData.replacementUnit}
                            onChange={(value) => updateField("replacementUnit", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.replacementUnit || ""}
                        />
                    </div>
                )}
            </div>

            <div className="formSection">
                <h3>Select Grain</h3>
                <div className="inventory-form-row1">
                    <DropdownField
                        id="edit-grainType"
                        label={<b>Select Grain: </b>}
                        options={grainOptions}
                        value={formData.grainType}
                        onChange={(value) => updateField("grainType", value)}
                        allowCustom={false}
                        isRequired={true}
                        error={errors.grainType || ""}
                    />

                    <NumberField
                        id="edit-grainAmount"
                        label={<b>Serving Amount: </b>}
                        value={formData.grainAmount}
                        onChange={(value) => updateField("grainAmount", value)}
                        isRequired={true}
                        error={errors.grainAmount || ""}
                    />

                    <DropdownField
                        id="edit-grainUnit"
                        label={<b>Unit: </b>}
                        options={UNITS}
                        value={formData.grainUnit}
                        onChange={(value) => updateField("grainUnit", value)}
                        allowCustom={false}
                        isRequired={true}
                        error={errors.grainUnit || ""}
                    />
                </div>

                <div className="inventory-form-row3">
                    <CheckboxField
                        id="edit-addFoodAdditive"
                        label={<b>Grain is mixed with an additive</b>}
                        checked={formData.addFoodAdditive}
                        onChange={handleFoodAdditiveChange}
                    />
                </div>

                {formData.addFoodAdditive && (
                    <div className="inventory-form-row1">
                        <DropdownField
                            id="edit-foodAdditive"
                            label={<b>Select Food Additive: </b>}
                            options={foodAdditiveOptions}
                            value={formData.foodAdditive}
                            onChange={(value) => updateField("foodAdditive", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.foodAdditive || ""}
                        />

                        <NumberField
                            id="edit-additiveAmount"
                            label={<b>Serving Amount: </b>}
                            value={formData.additiveAmount}
                            onChange={(value) => updateField("additiveAmount", value)}
                            isRequired={true}
                            error={errors.additiveAmount || ""}
                        />

                        <DropdownField
                            id="edit-additiveUnit"
                            label={<b>Unit: </b>}
                            options={UNITS}
                            value={formData.additiveUnit}
                            onChange={(value) => updateField("additiveUnit", value)}
                            allowCustom={false}
                            isRequired={true}
                            error={errors.additiveUnit || ""}
                        />
                    </div>
                )}
            </div>

            <div className="formSection">
                <h3>Additional Information</h3>
                <div className="checkboxGrid">
                    <CheckboxField
                        id="edit-mustSeparate"
                        label={<b>Horse must be separated from other horses during feeding time</b>}
                        checked={formData.mustSeparate}
                        onChange={(value) => updateField("mustSeparate", value)}
                    />

                    <CheckboxField
                        id="edit-soakFeed"
                        label={<b>All feed must be soaked for 30 minutes prior to serving</b>}
                        checked={formData.soakFeed}
                        onChange={(value) => updateField("soakFeed", value)}
                    />

                    <CheckboxField
                        id="edit-hayNet"
                        label={<b>If horse eats hay, then slow feeding nets must be used</b>}
                        checked={formData.hayNet}
                        onChange={(value) => updateField("hayNet", value)}
                    />
                </div>

                <div className="inventory-form-row3">
                    <TextAreaField
                        id="edit-feedingInstructions"
                        label={<b>Feeding Instructions and Notes: </b>}
                        value={formData.feedingInstructions}
                        placeholder="Enter any specific feeding instructions to meet horse care requirements. Add notes on horse disposition around food. Example: Horse tends to be alpha in pasture, please feed first."
                        onChange={(value) => updateField("feedingInstructions", value)}
                        maxLength={1000}
                    />
                </div>
            </div>

            <div className="formButton">
                <Button label="Cancel" variant="secondary" type="button" onClick={onCancel} />
                <Button label="Save Feeding Regime" type="submit" />
            </div>
            </div>
        </form>
    );
}

export default FeedingRegimeEditForm;
