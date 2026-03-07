import {useState, useEffect } from "react";

// Form components
import TextField from "../components/Form/TextField.jsx"
import NumberField from '../components/Form/NumberField.jsx';
import DropdownField from "../components/Form/DropdownField.jsx";
import TextAreaField from '../components/Form/TextAreaField.jsx';
import UploadImage from "../components/Form/UploadImage.jsx";
import Button from '../components/Button/Button.jsx';

export function AddInventoryForm() {
    //----------------------Hard-Coded Lists----------------------//
    const categoryOptions = [
        "Hay",
        "Grain",
        "Treats",
        "Supplements",
        "Medication",
        "Grooming",
        "Barn Supplies",
        "Other"
    ];

    const gradeOptions = [
        "Premium",
        "Standard",
        "Economy",
        "Not Applicable"
    ]

    //--------------------Handle Form Submission------------------//
    const [touched, setTouched] = useState({
        label: false,
        quantity: false,
        category: false,
        grade: false,
        instructions: false,
        imageFile: false,
    });

    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    //--------------Handle empty required fields----------------//
    const [errors, setErrors] = useState({});

    function validateField(name, value) {
        switch (name) {
            case "label":
                if (!value.trim()) return "Item name is required.";
                return "";

            case "quantity":
                if (value === "" || value === null) return "Quantity is required.";
                if (Number(value) < 0) return "Quantity cannot be negative.";
                return "";

            case "category":
                if (!value.trim()) return "Category is required.";
                return "";

            case "grade":
                if (!value.trim()) return "Grade is required.";
                return "";

            case "instructions":
                if (!value.trim()) return "Instructions are required.";
                return "";

            case "imageFile":
                if (!value) return "An item image is required.";
                return "";

            default:
                return "";
        }
    }

    // Marks a field as touched
    function handleBlur(fieldName, value) {
        setTouched((prev) => ({
            ...prev,
            [fieldName]: true
        }));

        setErrors((prev) => ({
            ...prev,
            [fieldName]: validateField(fieldName, value)
        }));
    }

    // Updates an error when value changes
    function updateField(fieldName, value, setter) {
        setter(value);

        if (touched[fieldName]) {
            setErrors((prev) => ({
                ...prev,
                [fieldName]: validateField(fieldName, value),
            }));
        }
    }

    //-------------------------Item Label-------------------------//
    const [label, setLabel] = useState("");

    //--------------------------Quantity--------------------------//
    const [quantity, setQuantity] = useState(0);

    //--------------------=-----Category---------=----------------//
    const [category, setCategory] = useState("");

    //----------------------------Grade---------------------------//
    const [grade, setGrade] = useState("");

    //------------------------Instructions------------------------//
    const [instructions, setInstructions] = useState("");

    //------------------------Instructions------------------------//
    const [imageFile, setImageFile] = useState(null);

    //--------------------Handle Form Submission------------------//

    useEffect(() => {
        if (!submitStatus.message) return;

        const timer = setTimeout(() => {
            setSubmitStatus({
                type: "",
                message: ""
            })
        }, 10000);

        return () => clearTimeout(timer)
    }, [submitStatus]);

    async function HandleSubmit(e) {
        e.preventDefault()

        const newTouched = {
            label: true,
            quantity: true,
            category: true,
            grade: true,
            instructions: true,
            imageFile: true
        };

        setTouched(newTouched);

        const newErrors = {
            label: validateField("label", label),
            quantity: validateField("quantity", quantity),
            category: validateField("category", category),
            grade: validateField("grade", grade),
            instructions: validateField("instructions", instructions),
            imageFile: validateField("imageFile", imageFile)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error);

        if (hasErrors) {
            setSubmitStatus({
                type: "error",
                message: "Please fix the highlighted fields before submitting."
            });
            return
        }

        try {
            const formData = new FormData();
            formData.append("label", label);
            formData.append("Quantity", quantity);
            formData.append("category", category);
            formData.append("grade", grade);
            formData.append("instructions", instructions);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await fetch("", {
                method: "POST",
                body: formData
            })

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to add inventory item.");
            }

            setSubmitStatus({
                type: "success",
                message: "Item has successfully submitted."
            });

            setLabel("");
            setQuantity(0);
            setCategory("");
            setGrade("");
            setInstructions("");
            setImageFile(null);

            setErrors({});
            setTouched({
                label: false,
                quantity: false,
                category: false,
                grade: false,
                instructions: false,
                imageFile: false,
            });
        }
        catch (err) {
            setSubmitStatus({
                type: "error",
                message: err.message || "Something went wrong while submitting the item."
            })
        }
    }

    return (
        <div className="formContainer">
            <h2>Inventory Form</h2>

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

            <div className="formNote">
                Please check that the item does not already exist in the inventory before adding a new entry.
            </div>

            <form onSubmit={HandleSubmit}>
                <div className="formInputs">
                    <div className="inventory-form-row1">

                        <TextField                      // Item Label Field
                            id="label"
                            label={<b>Item: </b>}
                            placeholder="Enter Item Label"
                            value={label}
                            onChange={(value) => updateField("label", value, setLabel)}
                            icon_label="Item help"
                            title="Item Label"
                            body="Use the common name staff would recognize immediately.

                                If the item has a brand, use the format,
                                BrandName – Product.

                                Examples: Farnam – Fly Spray or Alfalfa Hay"
                            isRequired={true}
                            error={touched.label ? errors.label : ""}
                            onBlur={() => handleBlur("label", label)}
                        />

                        <NumberField                    // Quantity Field
                            id="quantity"
                            label={<b>Quantity: </b>}
                            value={quantity}
                            placeholder={0}
                            onChange={(value) => updateField("quantity", value, setQuantity)}
                            icon_label="Quantity help"
                            title="Item Quantity"
                            body="Enter the current quantity available in inventory. Quantity cannot be negative."
                            error={touched.quantity ? errors.quantity : ""}
                        />

                    </div>
                    <div className="inventory-form-row2">

                        <DropdownField                // Category Field
                            id="category"
                            label={<b>Category: </b>}
                            options={categoryOptions}
                            value={category}
                            onChange={(value) => updateField("category", value, setCategory)}
                            allowCustom={true}
                            customLabel={<b>Specify Category: </b>}
                            icon_label="Category help"
                            title="Category"
                            body="Choose the closest match. Use Other only when the item does not fit an existing category."
                            isRequired={true}
                            error={touched.category ? errors.category : ""}
                            onBlur={() => handleBlur("category", category)}
                        />

                        <DropdownField                  // Grade Field
                            id="grade"
                            label={<b>Grade: </b>}
                            options={gradeOptions}
                            value={grade}
                            onChange={(value) => updateField("grade", value, setGrade)}
                            allowCustom={false}
                            customLabel={<b>Specify Grade: </b>}
                            icon_label="Grade help"
                            title="Grade"
                            body="Use grade for products with quality levels, such as hay. If the item does not have a grade, select Not Applicable."
                            isRequired={true}
                            error={touched.grade ? errors.grade : ""}
                            onBlur={() => handleBlur("grade", grade)}
                        />

                    </div>
                    <div className="inventory-form-row3">
                        <TextAreaField                  // Instructions Field
                            id="instructions"
                            label={<b>Instructions: </b>}
                            value={instructions}
                            placeholder="Enter Instructions for product use"
                            onChange={(value) => updateField("instructions", value, setInstructions)}
                            maxLength={1000}
                            icon_label="Instructions help"
                            title="Instructions"
                            body="Add notes for use, dosage, feeding directions, storage, or handling so staff know exactly how the item should be used."
                            isRequired={true}
                            error={touched.instructions ? errors.instructions : ""}
                            onBlur={() => handleBlur("instructions", instructions)}
                            touched={touched.instructions}
                        />
                    </div>

                    <div className="inventory-form-row4">
                        <UploadImage
                            id="item-image"
                            label={<b>Item Image:</b>}
                            value={imageFile}
                            onChange={(file) => updateField("imageFile", file, setImageFile)}
                            icon_label="Item image help"
                            title="Item Image"
                            body="Upload one clear image of the item for quick identification. Only one image is allowed."
                            maxSizeMB={10}
                            isRequired={true}
                            error={touched.imageFile ? errors.imageFile : ""}
                            onBlur={() => handleBlur("imageFile", imageFile)}
                        />
                    </div>

                </div>
                <div className="formButton">
                <Button label="Add Item"/>
                </div>
            </form>
        </div>
    );
}

export default AddInventoryForm;