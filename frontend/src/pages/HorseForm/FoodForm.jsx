import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {handleBlur} from "../../utils/FormUtil.js";
import CheckboxField from "../../components/Form/Checkbox.jsx";
import DropdownField from "../../components/Form/DropdownField.jsx";
import NumberField from "../../components/Form/NumberField.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import Button from "../../components/Button/Button.jsx";


function FoodForm() {
    const { formData, setFormData } = useOutletContext();
    const navigate = useNavigate();

    const units = ["scoop", "cup", "oz", "lb", "tbsp", "tsp", "mL"]

    const [touched, setTouched] = useState({
        feedHay: false,
        hayType: false,
        hayAmount: false,
        hayReplacement: false,
        replacementAmount: false,
        replacementUnit: false,

        grainType: false,
        grainAmount: false,
        grainUnit: false,
        addFoodAdditive: false,
        foodAdditive: false,
        additiveAmount: false,
        additiveUnit: false,

        mustSeparate: false,
        soakFeed: false,
        hayNet: false,
        feedingInstructions: false
    });

    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    const [errors, setErrors] = useState({});

    function validateField(name, value) {
        switch (name) {
            case "hayType":
                if (formData.feedHay && !value) return "Hay type is required.";
                return "";

            case "hayAmount":
                if (formData.feedHay && !value) return "Hay serving size is required.";
                if (formData.feedHay && Number(value) <= 0) return "Hay serving size must be greater than 0.";
                if (formData.feedHay && !Number.isInteger(Number(value))) {
                    return "Hay serving size must be a whole number of flakes.";
                }
                return "";

            case "hayReplacement":
                if (!formData.feedHay && !value?.trim()) return "Hay replacement is required.";
                return "";

            case "replacementAmount":
                if (!formData.feedHay && !value) return "Hay substitute serving size is required.";
                return "";

            case "replacementUnit":
                if (!formData.feedHay && !value) return "Hay substitute serving unit is required.";
                return "";

            case "grainType":
                if (!value?.trim()) return "Grain type is required.";
                return "";

            case "grainAmount":
                if (!value) return "Grain serving size is required.";
                return "";

            case "grainUnit":
                if (!value?.trim()) return "Grain serving unit is required.";
                return "";

            case "foodAdditive":
                if (formData.addFoodAdditive && !value) return "Food additive is required.";
                return "";

            case "additiveAmount":
                if (formData.addFoodAdditive && !value) return "Food additive serving size is required.";
                return "";

            case "additiveUnit":
                if (formData.addFoodAdditive && !value) return "Food additive serving unit is required.";
                return "";

            default:
                return "";
        }
    }

    //------------------------FEEDHAY-------------------------\\
    function handleFeedHayChange(value) {
        setFormData((prev) => ({
            ...prev,
            feedHay: value,
            hayType: value ? prev.hayType : "",
            hayReplacement: value ? "" : prev.hayReplacement
        }));

        if (touched.hayType) {
            setErrors((prev) => ({
                ...prev,
                hayType: validateField("hayType", value ? formData.hayType : ""),
                hayReplacement: validateField("hayReplacement", value ? "" : formData.hayReplacement)
            }));
        }
    }

    //------------------------ADD FOOD ADDITIVE-------------------------\\
    function handleFoodAdditiveChange(value) {
        setFormData((prev) => ({
            ...prev,
            addFoodAdditive: value,
            foodAdditive: value ? prev.foodAdditive : "",
        }));

        setErrors((prev) => ({
            ...prev,
            foodAdditive: validateField("foodAdditive", value ? formData.foodAdditive : ""),
        }));
    }

    //----------------------HAY---------------------\\
    const [hay, setHay] = useState([]);
    const [hayLoading, setHayLoading] = useState(true);
    const [hayError, setHayError] = useState("");

    useEffect(() => {
        async function fetchHay() {
            try {
                setHayLoading(true);
                setHayError("");

                const response = await fetch("http://localhost:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch hay: ${response.status}`);
                }

                const data = await response.json();

                const hayNames = Array.isArray(data)
                    ? data
                        .filter((item) => item.category === "Hay")
                        .map((item) => item.label)
                    : [];

                setHay(hayNames);
            } catch (error) {
                console.error("Error fetching hay:", error);
                setHayError(`Could not fetch hay: ${error.message}`);
            } finally {
                setHayLoading(false);
            }
        }

        fetchHay();
    }, []);

    //----------------------GRAIN---------------------\\
    const [grain, setGrain] = useState([]);
    const [grainLoading, setGrainLoading] = useState(true);
    const [grainError, setGrainError] = useState("");

    useEffect(() => {
        async function fetchGrain() {
            try {
                setGrainLoading(true);
                setGrainError("");

                const response = await fetch("http://localhost:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch grain: ${response.status}`);
                }

                const data = await response.json();

                const grainNames = Array.isArray(data)
                    ? data
                        .filter((item) => item.category === "Grain")
                        .map((item) => item.label)
                    : [];

                setGrain(grainNames);
            } catch (error) {
                console.error("Error fetching grain:", error);
                setGrainError(`Could not fetch grain: ${error.message}`);
            } finally {
                setGrainLoading(false);
            }
        }

        fetchGrain();
    }, []);


    //-------------------------FOOD ADDITIVES--------------------------\\
    const [foodAdditives, setFoodAdditives] = useState([]);
    const [foodAdditivesLoading, setFoodAdditivesLoading] = useState(true);
    const [foodAdditivesError, setFoodAdditivesError] = useState("");

    useEffect(() => {
        async function fetchFoodAdditives() {
            try {
                setFoodAdditivesLoading(true);
                setFoodAdditivesError("");

                const response = await fetch("http://localhost:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch food additives: ${response.status}`);
                }

                const data = await response.json();

                const foodAdditiveNames = Array.isArray(data)
                    ? data
                        .filter((item) => item.category === "Food Additive")
                        .map((item) => item.label)
                    : [];

                setFoodAdditives(foodAdditiveNames);
            }
            catch (error) {
                console.error("Error fetching food additives:", error);
                setFoodAdditivesError(`Could not fetch food additives: ${error.message}`);
            }
            finally {
                setFoodAdditivesLoading(false);
            }
        }

        fetchFoodAdditives();
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
            feedHay: true,
            hayType: true,
            hayAmount: true,
            hayReplacement: true,
            replacementAmount: true,
            replacementUnit: true,

            grainType: true,
            grainAmount: true,
            grainUnit: true,
            addFoodAdditive: true,
            foodAdditive: true,
            additiveAmount: true,
            additiveUnit: true,

            mustSeparate: true,
            soakFeed: true,
            hayNet: true,
            feedingInstructions: true
        };

        setTouched(newTouched);

        const newErrors = {
            feedHay: validateField("feedHay", formData.feedHay),
            hayType: validateField("hayType", formData.hayType),
            hayAmount: validateField("hayAmount", formData.hayAmount),
            hayReplacement: validateField("hayReplacement", formData.hayReplacement),
            replacementAmount: validateField("replacementAmount", formData.replacementAmount),
            replacementUnit: validateField("replacementUnit", formData.replacementUnit),

            grainType: validateField("grainType", formData.grainType),
            grainAmount: validateField("grainAmount", formData.grainAmount),
            grainUnit: validateField("grainUnit", formData.grainUnit),
            addFoodAdditive: validateField("addFoodAdditive", formData.addFoodAdditive),
            foodAdditive: validateField("foodAdditive", formData.foodAdditive),
            additiveAmount: validateField("additiveAmount", formData.additiveAmount),
            additiveUnit: validateField("additiveUnit", formData.additiveUnit),

            mustSeparate: validateField("mustSeparate", formData.mustSeparate),
            soakFeed: validateField("soakFeed", formData.soakFeed),
            hayNet: validateField("hayNet", formData.hayNet),
            feedingInstructions: validateField("feedingInstructions", formData.feedingInstructions),
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

        navigate("owner");
    }

    return (
        <div className="formContainer">
            <h2>Feeding Regime</h2>

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

            {hayLoading && (
                <div className="formAlert">
                    Loading hay...
                </div>
            )}

            {hayError && (
                <div className="formAlert error">
                    {hayError}
                </div>
            )}

            {grainLoading && (
                <div className="formAlert">
                    Loading grain...
                </div>
            )}

            {grainError && (
                <div className="formAlert error">
                    {grainError}
                </div>
            )}

            {foodAdditivesLoading && (
                <div className="formAlert">
                    Loading food additives...
                </div>
            )}

            {foodAdditivesError && (
                <div className="formAlert error">
                    {foodAdditivesError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="formInputs">

                    <div className="formNote">
                        Feeding decisions must be made based on current horse conditions. If horse is prone to colics and/or choking, please opt in to soaking feed.
                    </div>

                    <div className="formSection">

                        <h3>Select Primary Feed</h3>
                        <div className="inventory-form-row3">
                            <CheckboxField
                                id="feedHay"
                                label={<b>Horse is fed hay</b>}
                                checked={formData.feedHay}
                                onChange={handleFeedHayChange}
                                error={touched.feedHay ? errors.feedHay : ""}
                                onBlur={() =>
                                    handleBlur("feedHay", formData.feedHay, setTouched, setErrors, validateField)
                                }
                            />
                        </div>
                        <div className="inventory-form-row2">
                            {formData.feedHay && (
                                <>
                                <DropdownField
                                    id="hayType"
                                    label={<b>Select Hay Type: </b>}
                                    options={hay}
                                    value={formData.hayType}
                                    onChange={(value) => updateField("hayType", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                    error={touched.hayType ? errors.hayType : ""}
                                    onBlur={() => handleBlur("hayType", formData.hayType, setTouched, setErrors, validateField)}
                                />

                                <NumberField                    // Quantity Field
                                    id="hayAmount"
                                    label={<b>Serving Amount (Flakes): </b>}
                                    value={formData.hayAmount}
                                    onChange={(value) =>updateField("hayAmount", value)}
                                    step="1"
                                    min={1}
                                    isRequired={true}
                                    error={touched.hayAmount ? errors.hayAmount : ""}
                                    onBlur={() => handleBlur("hayAmount", formData.hayAmount, setTouched, setErrors, validateField)}
                                />

                                </>
                            )}
                        </div>

                        <div className="inventory-form-row1">
                            {!formData.feedHay && (
                                <>
                                <DropdownField
                                    id="hayReplacement"
                                    label={<b>Hay alternative: </b>}
                                    options={foodAdditives}
                                    value={formData.hayReplacement}
                                    onChange={(value) => updateField("hayReplacement", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                    error={touched.hayReplacement ? errors.hayReplacement : ""}
                                    onBlur={() => handleBlur("hayReplacement", formData.hayReplacement, setTouched, setErrors, validateField)}
                                />

                                <NumberField                    // Quantity Field
                                    id="replacementAmount"
                                    label={<b>Serving Amount: </b>}
                                    value={formData.replacementAmount}
                                    onChange={(value) =>updateField("replacementAmount", value)}
                                    isRequired={true}
                                    error={touched.replacementAmount ? errors.replacementAmount : ""}
                                    onBlur={() => handleBlur("replacementAmount", formData.replacementAmount, setTouched, setErrors, validateField)}
                                />

                                <DropdownField
                                    id="replacementUnit"
                                    label={<b>Unit: </b>}
                                    options={units}
                                    value={formData.replacementUnit}
                                    onChange={(value) => updateField("replacementUnit", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                    error={touched.hayReplacement ? errors.replacementUnit : ""}
                                    onBlur={() => handleBlur("replacementUnit", formData.replacementUnit, setTouched, setErrors, validateField)}
                                />
                                </>
                                )}
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Select Grain</h3>
                        <div className="inventory-form-row1">
                            <DropdownField
                                id="grainType"
                                label={<b>Select Grain: </b>}
                                options={grain}
                                value={formData.grainType}
                                onChange={(value) => updateField("grainType", value)}
                                isRequired={true}
                                error={touched.grainType ? errors.grainType : ""}
                                onBlur={() => handleBlur("grainType", formData.grainType, setTouched, setErrors, validateField)}
                            />

                            <NumberField                    // Quantity Field
                                id="grainAmount"
                                label={<b>Serving Amount: </b>}
                                value={formData.grainAmount}
                                onChange={(value) =>updateField("grainAmount", value)}
                                isRequired={true}
                                error={touched.grainAmount ? errors.grainAmount : ""}
                                onBlur={() => handleBlur("grainAmount", formData.grainAmount, setTouched, setErrors, validateField)}
                            />

                                <DropdownField
                                    id="grainUnit"
                                    label={<b>Unit: </b>}
                                    options={units}
                                    value={formData.grainUnit}
                                    onChange={(value) => updateField("grainUnit", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                    error={touched.grainUnit ? errors.grainUnit : ""}
                                    onBlur={() => handleBlur("grainUnit", formData.grainUnit, setTouched, setErrors, validateField)}
                                />
                        </div>

                        <div className="inventory-form-row3">
                            <CheckboxField
                                id="addFoodAdditive"
                                label={<b>Grain is mixed with an additive</b>}
                                checked={formData.addFoodAdditive}
                                onChange={handleFoodAdditiveChange}
                                error={touched.addFoodAdditive ? errors.addFoodAdditive : ""}
                                onBlur={() =>
                                    handleBlur("addFoodAdditive", formData.addFoodAdditive, setTouched, setErrors, validateField)
                                }
                            />
                        </div>

                        {formData.addFoodAdditive && (
                            <div className="inventory-form-row1">
                                <DropdownField
                                    id="foodAdditive"
                                    label={<b>Select Food Additive: </b>}
                                    options={foodAdditives}
                                    value={formData.foodAdditive}
                                    onChange={(value) => updateField("foodAdditive", value)}
                                    isRequired={true}
                                    error={touched.foodAdditive ? errors.foodAdditive : ""}
                                    onBlur={() => handleBlur("foodAdditive", formData.foodAdditive, setTouched, setErrors, validateField)}
                                />

                                <NumberField                    // Quantity Field
                                    id="additiveAmount"
                                    label={<b>Serving Amount: </b>}
                                    value={formData.additiveAmount}
                                    onChange={(value) =>updateField("additiveAmount", value)}
                                    isRequired={true}
                                    error={touched.additiveAmount ? errors.additiveAmount : ""}
                                    onBlur={() => handleBlur("additiveAmount", formData.additiveAmount, setTouched, setErrors, validateField)}
                                />

                                <DropdownField
                                    id="additiveUnit"
                                    label={<b>Unit: </b>}
                                    options={units}
                                    value={formData.additiveUnit}
                                    onChange={(value) => updateField("additiveUnit", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                    error={touched.additiveUnit ? errors.additiveUnit : ""}
                                    onBlur={() => handleBlur("additiveUnit", formData.additiveUnit, setTouched, setErrors, validateField)}
                                />
                            </div>
                            )}
                    </div>

                    <div className="formSection">
                        <h3>Additional Information</h3>
                        <div className="inventory-form-row4">

                            <CheckboxField
                                id="mustSeparate"
                                label={<b>Horse must be separated from other horses during feeding time</b>}
                                checked={formData.mustSeparate}
                                onChange={(value) => updateField("mustSeparate", value)}
                                error={touched.mustSeparate ? errors.mustSeparate : ""}
                                onBlur={() =>
                                    handleBlur("mustSeparate", formData.mustSeparate, setTouched, setErrors, validateField)
                                }
                            />

                            <CheckboxField
                                id="soakFeed"
                                label={<b>All feed must be soaked for 30 minutes prior to serving</b>}
                                checked={formData.soakFeed}
                                onChange={(value) => updateField("soakFeed", value)}
                                error={touched.soakFeed ? errors.soakFeed : ""}
                                onBlur={() =>
                                    handleBlur("soakFeed", formData.soakFeed, setTouched, setErrors, validateField)
                                }
                            />

                            <CheckboxField
                                id="hayNet"
                                label={<b>If horse eats hay, then slow feeding nets must be used</b>}
                                checked={formData.hayNet}
                                onChange={(value) => updateField("hayNet", value)}
                                error={touched.hayNet ? errors.hayNet : ""}
                                onBlur={() =>
                                    handleBlur("hayNet", formData.hayNet, setTouched, setErrors, validateField)
                                }
                            />

                            <TextAreaField
                                id="feedingInstructions"
                                label={<b>Feeding Instructions and Notes: </b>}
                                value={formData.feedingInstructions}
                                placeholder="Enter any specific feeding instructions to meet horse care requirements. Add notes on horse disposition around food. Example: Horse tends to be alpha in pasture, please feed first."
                                onChange={(value) =>updateField("feedingInstructions", value)}
                                maxLength={1000}
                                isRequired={false}
                                error={touched.feedingInstructions ? errors.feedingInstructions : ""}
                                onBlur={() => handleBlur("feedingInstructions", formData.feedingInstructions, setTouched, setErrors, validateField)}
                                touched={touched.feedingInstructions}
                            />
                        </div>
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

export default FoodForm;
