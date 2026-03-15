import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import TextField from "../../components/Form/TextField.jsx";
import {handleBlur} from "../../utils/FormUtil.js";
import DropdownField from "../../components/Form/DropdownField.jsx";
import CheckboxField from "../../components/Form/CheckBox.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import UploadImage from "../../components/Form/UploadImage.jsx";
import Button from "../../components/Button/Button.jsx";

function HorseForm() {
    const { formData, setFormData } = useOutletContext();
    const navigate = useNavigate();

    const sexOptions = [
        "Mare",
        "Gelding",
        "Stallion"
    ];

    const [touched, setTouched] = useState({
        horseName: false,
        breed: false,
        sex: false,
        birthdate: false,
        pastureName: false,
        hasStall: false,
        barn: false,
        stallId: false,
        temperament: false,
        notes: false,
        image: false
    });

    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    const [errors, setErrors] = useState({});

    function validateField(name, value) {
        switch (name) {
            case "horseName":
                if (!value?.trim()) return "Name of horse is required.";
                return "";

            case "breed":
                if (!value?.trim()) return "Breed is required.";
                return "";

            case "sex":
                if (!value?.trim()) return "Sex is required.";
                return "";

            case "birthdate": {
                if (!value) return "Birthdate is required.";

                const selectedDate = new Date(value);
                const today = new Date();
                const fiftyYearsAgo = new Date();

                today.setHours(0, 0, 0, 0);
                fiftyYearsAgo.setFullYear(today.getFullYear() - 50);

                if (selectedDate > today) {
                    return "Birthdate cannot be in the future.";
                }

                if (selectedDate < fiftyYearsAgo) {
                    return "Birthdate seems unrealistic.";
                }

                return "";
            }

            case "pastureName":
                if (!formData.hasStall && !value?.trim()) {
                    return "Pasture location is required if no stall is assigned.";
                }
                return "";

            case "hasStall":
                return "";

            case "barn":
                if (formData.hasStall && !value?.trim()) {
                    return "Barn name is required if stall is assigned.";
                }
                return "";

            case "stallId":
                if (formData.hasStall && !value?.trim()) {
                    return "Stall ID is required.";
                }
                return "";

            case "temperament":
                if (!value?.trim()) return "Horse temperament is required.";
                return "";

            case "notes":
                return "";

            case "image":
                if (!value) return "Image of the horse is required.";
                return "";

            default:
                return "";
        }
    }

    //----------------------Breed Dropdown Field---------------------\\
    const [breeds, setBreeds] = useState([]);
    const [breedsLoading, setBreedsLoading] = useState(true);
    const [breedsError, setBreedsError] = useState("");

    useEffect(() => {
        async function fetchBreeds() {
            try {
                setBreedsLoading(true);
                setBreedsError("");

                const response = await fetch("http://localhost:8002/api/breed/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch breeds: ${response.status}`);
                }

                const data = await response.json();

                const breedNames = Array.isArray(data)
                    ? data.map((breed) => breed.name)
                    : [];

                setBreeds(breedNames);
            } catch (error) {
                console.error("Error fetching breeds:", error);
                setBreedsError(`Could not fetch breeds: ${error.message}`);
            } finally {
                setBreedsLoading(false);
            }
        }

        fetchBreeds();
    }, []);

    //------------------------HASSTALL LOGIC-------------------------\\
    function handleHasStallChange(value) {
        setFormData((prev) => ({
            ...prev,
            hasStall: value,
            stallId: value ? prev.stallId : "",
            barn: value ? prev.barn : ""
        }));

        if (!value) {
            setTouched((prev) => ({
                ...prev,
                stallId: false,
                barn: false
            }));

            setErrors((prev) => ({
                ...prev,
                hasStall: "",
                stallId: "",
                barn: ""
            }));
        }
    }

    //---------------------BARN NAME=---------------------\\
    const [barns, setBarns] = useState([]);
    const [barnsLoading, setBarnsLoading] = useState(true);
    const [barnsError, setBarnsError] = useState("");

    useEffect(() => {
        async function fetchBarns() {
            try {
                setBarnsLoading(true);
                setBarnsError("");

                const response = await fetch("http://localhost:8002/api/barn/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch barns: ${response.status}`);
                }

                const data = await response.json();

                const barnNames = Array.isArray(data)
                    ? data.map((barn) => barn.name)
                    : [];

                setBarns(barnNames);
            } catch (error) {
                console.error("Error fetching barns:", error);
                setBarnsError(`Could not fetch barns: ${error.message}`);
            } finally {
                setBarnsLoading(false);
            }
        }

        fetchBarns();
    }, []);

    //-------------------------PASTURE NAME--------------------------\\
    const [pastures, setPastures] = useState([]);
    const [pasturesLoading, setPasturesLoading] = useState(true);
    const [pasturesError, setPasturesError] = useState("");

    useEffect(() => {
        async function fetchPastures() {
            try {
                setPasturesLoading(true);
                setPasturesError("");

                const response = await fetch("http://localhost:8002/api/pastures/");

                if (!response.ok) {
                    throw new Error(`Failed to fetch pastures: ${response.status}`);
                }

                const data = await response.json();

                const pastureNames = Array.isArray(data)
                    ? data.map((pasture) => pasture.name)
                    : [];

                setPastures(pastureNames);
            }
            catch (error) {
                console.error("Error fetching pastures:", error);
                setPasturesError(`Could not fetch pastures: ${error.message}`);
            }
            finally {
                setPasturesLoading(false);
            }
        }

        fetchPastures();
    }, []);

    //---------------------Handle Form submission---------------------\\

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

    async function HandleSubmit(e) {
        e.preventDefault();

        const newTouched = {
            horseName: true,
            breed: true,
            sex: true,
            birthdate: true,
            pastureName: true,
            hasStall: true,
            barn: true,
            stallId: true,
            temperament: true,
            notes: true,
            image: true
        };

        setTouched(newTouched);

        const newErrors = {
            horseName: validateField("horseName", formData.horseName),
            breed: validateField("breed", formData.breed),
            sex: validateField("sex", formData.sex),
            birthdate: validateField("birthdate", formData.birthdate),
            pastureName: validateField("pastureName", formData.pastureName),
            hasStall: validateField("hasStall", formData.hasStall),
            barn: validateField("barn", formData.barn),
            stallId: validateField("stallId", formData.stallId),
            temperament: validateField("temperament", formData.temperament),
            notes: validateField("notes", formData.notes),
            image: validateField("image", formData.image)
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

        navigate("medical");
    }

    return (
        <div className="formContainer">
            <h2>Horse Form</h2>

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

            {breedsLoading && (
                <div className="formAlert">
                    Loading breeds...
                </div>
            )}

            {breedsError && (
                <div className="formAlert error">
                    {breedsError}
                </div>
            )}

            {barnsLoading && (
                <div className="formAlert">
                    Loading barns...
                </div>
            )}

            {barnsError && (
                <div className="formAlert error">
                    {barnsError}
                </div>
            )}

            {pasturesLoading && (
                <div className="formAlert">
                    Loading pastures...
                </div>
            )}

            {pasturesError && (
                <div className="formAlert error">
                    {pasturesError}
                </div>
            )}

             <form onSubmit={HandleSubmit}>
                <div className="formInputs">
                    <div className="formSection">
                        <h3>Horse Details</h3>
                        <div className="inventory-form-row2">
                            <TextField
                                id="horseName"
                                label={<b>Horse Name: </b>}
                                placeholder="Enter Horse's Name"
                                value={formData.horseName}
                                onChange={(value) => updateField("horseName", value)}
                                isRequired={true}
                                error={touched.horseName ? errors.horseName : ""}
                                onBlur={() => handleBlur("horseName", formData.horseName, setTouched, setErrors, validateField)}
                            />

                            <TextField
                                id="birthdate"
                                type="date"
                                className="dateInput"
                                label={<b>Birthday: </b>}
                                value={formData.birthdate}
                                onChange={(value) => updateField("birthdate", value)}
                                icon_label="Birth date help"
                                title="Birth date"
                                body="Select the horse's birthdate. If the exact date is unknown, enter January 1 of the estimated year."
                                isRequired={true}
                                error={touched.birthdate ? errors.birthdate : ""}
                                onBlur={() => handleBlur("birthdate", formData.birthdate, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <div className="inventory-form-row2">
                        <DropdownField
                            id="sex"
                            label={<b>Sex: </b>}
                            options={sexOptions}
                            value={formData.sex}
                            onChange={(value) =>updateField("sex", value)}
                            allowCustom={false}
                            customLabel={<b>Sex: </b>}
                            icon_label="Sex help"
                            title="Sex"
                            body="If male is fixed, choose gelding. Otherwise, choose stallion."
                            isRequired={true}
                            error={touched.sex ? errors.sex : ""}
                            onBlur={() => handleBlur("sex", formData.sex, setTouched, setErrors, validateField)}
                        />


                        <DropdownField
                            id="breed"
                            label={<b>Breed: </b>}
                            options={breeds}
                            value={formData.breed}
                            onChange={(value) =>updateField("breed", value)}
                            allowCustom={false}
                            icon_label="Breed help"
                            title="Breed"
                            body="Choose your horse breed. Select Unknown if unsure or Mixed Breed if crossbred."
                            isRequired={true}
                            error={touched.breed ? errors.breed : ""}
                            onBlur={() => handleBlur("breed", formData.breed, setTouched, setErrors, validateField)}
                        />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Location Assignment</h3>
                        <div className="inventory-form-row2">
                            <CheckboxField
                                id="hasStall"
                                label={<b>Horse is assigned a stall.</b>}
                                checked={formData.hasStall}
                                onChange={handleHasStallChange}
                                error={touched.hasStall ? errors.hasStall : ""}
                                onBlur={() =>
                                    handleBlur("hasStall", formData.hasStall, setTouched, setErrors, validateField)
                                }
                            />
                        </div>

                        {formData.hasStall && (
                            <div className="stallFieldsRow">
                                <DropdownField
                                    id="barn"
                                    label={<b>Barn Name: </b>}
                                    options={barns}
                                    value={formData.barn}
                                    onChange={(value) => updateField("barn", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                    error={touched.barn ? errors.barn : ""}
                                    onBlur={() =>
                                        handleBlur("barn", formData.barn, setTouched, setErrors, validateField)
                                    }
                                />

                                <TextField
                                    id="stallId"
                                    label={<b>Stall ID: </b>}
                                    placeholder="Enter stall ID"
                                    value={formData.stallId}
                                    onChange={(value) => updateField("stallId", value)}
                                    isRequired={true}
                                    error={touched.stallId ? errors.stallId : ""}
                                    onBlur={() =>
                                        handleBlur("stallId", formData.stallId, setTouched, setErrors, validateField)
                                    }
                                />
                            </div>
                        )}

                        <div className="inventory-form-row4">
                            <DropdownField
                                    id="pastureName"
                                    label={<b>Pasture Name: </b>}
                                    options={pastures}
                                    value={formData.pastureName}
                                    onChange={(value) => updateField("pastureName", value)}
                                    allowCustom={false}
                                    icon_label="Pasture help"
                                    title="Pasture Assignment"
                                    body="Assign a pasture if the horse is not stalled. If the horse is stalled, this can remain blank unless you also want to assign turnout pasture."
                                    isRequired={!formData.hasStall}
                                    error={touched.pastureName ? errors.pastureName : ""}
                                    onBlur={() =>
                                        handleBlur("pastureName", formData.pastureName, setTouched, setErrors, validateField)
                                    }
                                />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Horse Disposition & Notes</h3>
                        <div className="inventory-form-row3">
                            <TextAreaField
                                id="temperament"
                                label={<b>Temperament: </b>}
                                value={formData.temperament}
                                placeholder="Enter the disposition of the horse"
                                onChange={(value) =>updateField("temperament", value)}
                                maxLength={1000}
                                icon_label="Temperament help"
                                title="Temperament"
                                body="Add details of horse characteristics. example: Horse tends to take the role of alpha, feed before other horses nearby. Horse shows signs of food aggression. Horse is social."
                                isRequired={true}
                                error={touched.temperament ? errors.temperament : ""}
                                onBlur={() => handleBlur("temperament", formData.temperament, setTouched, setErrors, validateField)}
                                touched={touched.temperament}
                            />

                            <TextAreaField
                                id="notes"
                                label={<b>Notes: </b>}
                                value={formData.notes}
                                placeholder="Enter any additional notes."
                                onChange={(value) =>updateField("notes", value)}
                                maxLength={1000}
                                icon_label="Notes help"
                                title="Notes"
                                body="Add any other information about the horse to best support care."
                                isRequired={false}
                                error={touched.notes ? errors.notes : ""}
                                onBlur={() => handleBlur("notes", formData.notes, setTouched, setErrors, validateField)}
                                touched={touched.notes}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Upload Image</h3>
                        <div className="inventory-form-row4">
                            <UploadImage
                                id="image"
                                label={<b>Select Image: </b>}
                                value={formData.image}
                                onChange={(value) => updateField("image", value)}
                                icon_label="Item image help"
                                title="Item Image"
                                body="Upload one clear image of the horse for quick identification. Only one image is allowed."
                                maxSizeMB={5}
                                isRequired={true}
                                error={touched.image ? errors.image : ""}
                                onBlur={() => handleBlur("image", formData.image, setTouched, setErrors, validateField)}
                            />
                        </div>

                        <div className="formButton">
                            <Button label="Next" type="submit"/>
                        </div>
                    </div>
                </div>
             </form>
        </div>
    );
}

export default HorseForm;