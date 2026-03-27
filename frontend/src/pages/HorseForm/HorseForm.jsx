import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import TextField from "../../components/Form/TextField.jsx";
import { handleBlur } from "../../utils/FormUtil.js";
import DropdownField from "../../components/Form/DropdownField.jsx";
import Toggle from "../../components/Form/Toggle.jsx";
import TextAreaField from "../../components/Form/TextAreaField.jsx";
import UploadImage from "../../components/Form/UploadImage.jsx";
import Button from "../../components/Button/Button.jsx";
import NumberField from "../../components/Form/NumberField.jsx";
import CheckboxField from "../../components/Form/Checkbox.jsx";
import InfoTip from "../../components/InfoTip/InfoTip.jsx";

function HorseForm() {
  const { formData, setFormData } = useOutletContext();
  const navigate = useNavigate();

  const sexOptions = ["Mare", "Gelding", "Stallion"];

  const [touched, setTouched] = useState({
      horseName: false,
      breed: false,
      sex: false,
      birthdate: false,
      height: false,
      weight: false,

      locationType: false,
      turnoutType: false,
      pastureName: false,
      barn: false,
      stallId: false,

      escapeRisk: false,
      mayBite: false,
      mayKick: false,
      difficultToCatch: false,
      herdDominant: false,
      sedationRequired: false,
      foodAggressive: false,
      requiresExperiencedHandler: false,

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

      case "height":
          if (value === "" || value === null || value === undefined) {
            return "Height is required.";
          }
          if (Number(value) <= 0) {
            return "Height must be greater than 0.";
          }
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

      case "locationType":
        if (!value) {
          return "Select whether the horse is assigned to a stall or lives in a pasture.";
        }
        return "";

      case "barn":
        if (formData.locationType === "stall" && !value?.trim()) {
          return "Barn name is required if stall is assigned.";
        }
        return "";

      case "stallId":
        if (formData.locationType === "stall" && !value?.trim()) {
          return "Stall ID is required.";
        }
        return "";

      case "pastureName":
        if (formData.locationType === "pasture" && !value?.trim()) {
          return "Pasture name is required if the horse lives in a pasture.";
        }
        return "";

      case "turnoutType":
          if (!formData.locationType === "pasture" && !value?.trim()) return "Turnout type is required.";
          if (formData.locationType === "pasture" && !value?.trim()) return "Pasture compatibility is required.";
          return "";

      case "image":
        if (!value) return "Image of the horse is required.";
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
        const breedNames = Array.isArray(data) ? data.map((breed) => breed.name) : [];
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
        const barnNames = Array.isArray(data) ? data.map((barn) => barn.name) : [];
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
        const pastureNames = Array.isArray(data) ? data.map((pasture) => pasture.name) : [];
        setPastures(pastureNames);
      } catch (error) {
        console.error("Error fetching pastures:", error);
        setPasturesError(`Could not fetch pastures: ${error.message}`);
      } finally {
        setPasturesLoading(false);
      }
    }

    fetchPastures();
  }, []);

  function handleLocationTypeChange(value) {
    setFormData((prev) => ({
      ...prev,
      locationType: value,
      barn: value === "stall" ? prev.barn : "",
      stallId: value === "stall" ? prev.stallId : "",
      pastureName: value === "pasture" ? prev.pastureName : ""
    }));

    setErrors((prev) => ({
      ...prev,
      locationType: "",
      barn: "",
      stallId: "",
      pastureName: ""
    }));

    if (value === "pasture") {
      setTouched((prev) => ({
        ...prev,
        barn: false,
        stallId: false
      }));
    }

    if (value === "stall") {
      setTouched((prev) => ({
        ...prev,
        pastureName: false
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
        horseName: true,
        breed: true,
        sex: true,
        birthdate: true,
        height: true,
        weight: true,

        locationType: true,
        turnoutType: true,
        pastureName: true,
        barn: true,
        stallId: true,

        escapeRisk: true,
        mayBite: true,
        mayKick: true,
        difficultToCatch: true,
        herdDominant: true,
        sedationRequired: true,
        foodAggressive: true,
        requiresExperiencedHandler: true,

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
        height: validateField("height", formData.height),
        weight: validateField("weight", formData.weight),

        locationType: validateField("locationType", formData.locationType),
        turnoutType: validateField("turnoutType", formData.turnoutType),
        pastureName: validateField("pastureName", formData.pastureName),
        barn: validateField("barn", formData.barn),
        stallId: validateField("stallId", formData.stallId),

        escapeRisk: validateField("escapeRisk", formData.escapeRisk),
        mayBite: validateField("mayBite", formData.mayBite),
        mayKick: validateField("mayKick", formData.mayKick),
        difficultToCatch: validateField("difficultToCatch", formData.difficultToCatch),
        herdDominant: validateField("herdDominant", formData.herdDominant),
        sedationRequired: validateField("sedationRequired", formData.sedationRequired),
        foodAggressive: validateField("foodAggressive", formData.foodAggressive),
        requiresExperiencedHandler: validateField("requiresExperiencedHandler", formData.requiresExperiencedHandler),

        temperament: validateField("temperament", formData.temperament),
        notes: validateField("notes", formData.notes),
        image: validateField("image", formData.image)
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the highlighted fields before continuing."
      });
      return;
    }

    navigate("medical");
  }

  return (
    <div className="formContainer">
      <h2>Horse Form</h2>

      {submitStatus.message && (
        <div className={submitStatus.type === "success" ? "formAlert success" : "formAlert error"}>
          {submitStatus.message}
        </div>
      )}

      {breedsLoading && <div className="formAlert">Loading breeds...</div>}
      {breedsError && <div className="formAlert error">{breedsError}</div>}

      {barnsLoading && <div className="formAlert">Loading barns...</div>}
      {barnsError && <div className="formAlert error">{barnsError}</div>}

      {pasturesLoading && <div className="formAlert">Loading pastures...</div>}
      {pasturesError && <div className="formAlert error">{pasturesError}</div>}

      <form onSubmit={handleSubmit}>
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
                onChange={(value) => updateField("sex", value)}
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
                onChange={(value) => updateField("breed", value)}
                allowCustom={false}
                icon_label="Breed help"
                title="Breed"
                body="Choose your horse breed. Select Unknown if unsure or Mixed Breed if crossbred."
                isRequired={true}
                error={touched.breed ? errors.breed : ""}
                onBlur={() => handleBlur("breed", formData.breed, setTouched, setErrors, validateField)}
              />

               <NumberField                    // Quantity Field
                   id="height"
                   label={<b>Height (hands): </b>}
                   value={formData.height}
                   onChange={(value) =>updateField("height", value)}
                   isRequired={true}
                   error={touched.height ? errors.height : ""}
                   onBlur={() => handleBlur("height", formData.height, setTouched, setErrors, validateField)}
               />

                <NumberField                    // Quantity Field
                   id="weight"
                   label={<b>Weight (lbs): </b>}
                   value={formData.weight}
                   onChange={(value) =>updateField("weight", value)}
                   isRequired={false}
                   error={touched.weight ? errors.weight : ""}
                   onBlur={() => handleBlur("weight", formData.weight, setTouched, setErrors, validateField)}
               />
            </div>
          </div>

          <div className="formSection">
            <h3>Location Assignment</h3>
            <div className="inventory-form-row3">
              <Toggle
                value={formData.locationType}
                onChange={handleLocationTypeChange}
                error={touched.locationType ? errors.locationType : ""}
              />

              {formData.locationType === "stall" && (
                  <div className="inventory-form-row2">
                      <DropdownField
                        id="barn"
                        label={<b>Barn Name: </b>}
                        options={barns}
                        value={formData.barn}
                        onChange={(value) => updateField("barn", value)}
                        allowCustom={false}
                        isRequired={true}
                        error={touched.barn ? errors.barn : ""}
                        onBlur={() => handleBlur("barn", formData.barn, setTouched, setErrors, validateField)}
                      />

                      <TextField
                        id="stallId"
                        label={<b>Stall ID: </b>}
                        placeholder="Enter stall ID"
                        value={formData.stallId}
                        onChange={(value) => updateField("stallId", value)}
                        isRequired={true}
                        error={touched.stallId ? errors.stallId : ""}
                        onBlur={() => handleBlur("stallId", formData.stallId, setTouched, setErrors, validateField)}
                      />

                      <DropdownField
                        id="turnoutType"
                        label={<b>Turnout Type: </b>}
                        options={[
                          "Group Turnout",
                          "Small Group Turnout",
                          "Mares only",
                          "Geldings only",
                          "Individual Paddock",
                          "Medical Turnout",
                          "Flexible"
                        ]}
                        value={formData.turnoutType}
                        onChange={(value) => updateField("turnoutType", value)}
                        allowCustom={false}
                        isRequired={true}
                        icon_label="Turnout type help"
                        title="Turnout Type"
                        body="Select the horse's preferred or required turnout arrangement. This helps staff place the horse in a safe and compatible turnout setting."
                        error={touched.turnoutType ? errors.turnoutType : ""}
                        onBlur={() =>
                          handleBlur(
                            "turnoutType",
                            formData.turnoutType,
                            setTouched,
                            setErrors,
                            validateField
                          )
                        }
                      />

                      <DropdownField
                        id="turnoutPasture"
                        label={<b>Turnout Pasture: </b>}
                        options={pastures}
                        value={formData.pastureName}
                        onChange={(value) => updateField("pastureName", value)}
                        allowCustom={false}
                        isRequired={false}
                        icon_label="Turnout pasture help"
                        title="Turnout Pasture"
                        body="Optionally assign a turnout pasture for stalled horses. Leave blank if turnout location is not fixed."
                        error={touched.pastureName ? errors.pastureName : ""}
                        onBlur={() =>
                          handleBlur(
                            "pastureName",
                            formData.pastureName,
                            setTouched,
                            setErrors,
                            validateField
                          )
                        }
                      />
                  </div>
                )}

                {formData.locationType === "pasture" && (
                  <div className="inventory-form-row2">
                    <DropdownField
                      id="pastureName"
                      label={<b>Pasture Name: </b>}
                      options={pastures}
                      value={formData.pastureName}
                      onChange={(value) => updateField("pastureName", value)}
                      allowCustom={false}
                      isRequired={true}
                      icon_label="Pasture help"
                      title="Pasture Assignment"
                      body="Select the pasture where the horse primarily resides."
                      error={touched.pastureName ? errors.pastureName : ""}
                      onBlur={() =>
                        handleBlur(
                          "pastureName",
                          formData.pastureName,
                          setTouched,
                          setErrors,
                          validateField
                        )
                      }
                    />

                    <DropdownField
                        id="turnoutType"
                        label={<b>Pasture Compatibility: </b>}
                        options={[
                          "Must live alone",
                          "Needs a buddy",
                          "Group pasture OK",
                          "Flexible"
                        ]}
                        value={formData.turnoutType}
                        onChange={(value) => updateField("turnoutType", value)}
                        allowCustom={false}
                        isRequired={true}
                        icon_label="Turnout type help"
                        title="Turnout Type"
                        body="Select the horse's preferred or required turnout arrangement. This helps staff place the horse in a safe and compatible turnout setting."
                        error={touched.turnoutType ? errors.turnoutType : ""}
                        onBlur={() =>
                          handleBlur(
                            "turnoutType",
                            formData.turnoutType,
                            setTouched,
                            setErrors,
                            validateField
                          )
                        }
                      />
                  </div>
                )}
            </div>
          </div>

          <div className="formSection">
            <h3>Horse Characteristics & Safety Flags</h3>

              <div className="inventory-form-row2">
                  <CheckboxField
                    id="escapeRisk"
                    label="Escape Risk"
                    checked={formData.escapeRisk}
                    onChange={(value) => updateField("escapeRisk", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, escapeRisk: true }))}
                  />

                  <CheckboxField
                    id="mayBite"
                    label="May bite"
                    checked={formData.mayBite}
                    onChange={(value) => updateField("mayBite", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, mayBite: true }))}
                  />

                  <CheckboxField
                    id="mayKick"
                    label="May Kick"
                    checked={formData.mayKick}
                    onChange={(value) => updateField("mayKick", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, mayKick: true }))}
                  />

                  <CheckboxField
                    id="difficultToCatch"
                    label="Difficult To Catch"
                    checked={formData.difficultToCatch}
                    onChange={(value) => updateField("difficultToCatch", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, difficultToCatch: true }))}
                  />

                  <CheckboxField
                    id="herdDominant"
                    label="Dominant in herd"
                    checked={formData.herdDominant}
                    onChange={(value) => updateField("herdDominant", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, herdDominant: true }))}
                  />

                  <CheckboxField
                    id="sedationRequired"
                    label="Sedation Required (Vet/Farrier)"
                    checked={formData.sedationRequired}
                    onChange={(value) => updateField("sedationRequired", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, sedationRequired: true }))}
                  />

                  <CheckboxField
                    id="foodAggressive"
                    label="Food Aggressive"
                    checked={formData.foodAggressive}
                    onChange={(value) => updateField("foodAggressive", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, foodAggressive: true }))}
                  />
                  <CheckboxField
                    id="requiresExperiencedHandler"
                    label="Requires Experienced Handler"
                    checked={formData.requiresExperiencedHandler}
                    onChange={(value) => updateField("requiresExperiencedHandler", value)}
                    isRequired={false}
                    onBlur={() => setTouched((prev) => ({ ...prev, requiresExperiencedHandler: true }))}
                />
                </div>
            </div>

            <div className="formSection">
                <h3>Additional Information</h3>
                <div className="inventory-form-row3">

                  <TextAreaField
                    id="temperament"
                    label={<b>Behavior Notes: </b>}
                    value={formData.temperament}
                    placeholder="Enter the disposition of the horse"
                    onChange={(value) => updateField("temperament", value)}
                    maxLength={1000}
                    icon_label="Temperament help"
                    title="Temperament"
                    body="Add details of horse characteristics. example: Horse tends to take the role of alpha, feed before other horses nearby. Horse shows signs of food aggression. Horse is social."
                    isRequired={false}
                    error={touched.temperament ? errors.temperament : ""}
                    onBlur={() => handleBlur("temperament", formData.temperament, setTouched, setErrors, validateField)}
                    touched={touched.temperament}
                  />

                  <TextAreaField
                    id="notes"
                    label={<b>Special Care Requests: </b>}
                    value={formData.notes}
                    placeholder="Enter any additional notes."
                    onChange={(value) => updateField("notes", value)}
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
              </div>
        </div>

        <div className="formButton">
          <Button label="Cancel" variant="secondary" type="button" onClick={() => navigate(-1)} />
          <Button label="Next" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default HorseForm;