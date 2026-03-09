import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";


function FoodForm() {
     const { formData, setFormData } = useOutletContext();
    const navigate = useNavigate();

    const breeds = ["American Warmblood"];

    const locationType = [
        "stall",
        "pasture",
        "other"
    ];

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

            case "birthdate":
                if (!value?.trim()) return "Birthdate is required.";
                return "";

            case "pastureName":
                if (!value?.trim()) return "Pasture location is required.";
                return "";

            case "hasStall":
                return "";

            case "barn":
                if (formData.hasStall && !value?.trim()) {
                    return "Barn is required if stall is assigned.";
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

    function updateFormField(fieldName, value) {
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
        </div>
    );
}

export default FoodForm;