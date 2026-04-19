import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleBlur, updateField } from "./../utils/formUtil.js";

// Form components
import TextField from "../components/Form/TextField.jsx";
import DropdownField from "../components/Form/DropdownField.jsx";
import TextAreaField from "../components/Form/TextAreaField.jsx";
import UploadDocument from "../components/Form/UploadDocument.jsx";
import Button from "../components/Button/Button.jsx";

export function AddDocument() {
    const navigate = useNavigate();
    const documentCategories = [
        "Barn Information",
        "Blank Templates",
        "Boarding Agreements",
        "Care Instructions",
        "Competition Records",
        "Invoice & Billing",
        "Lesson Agreements",
        "Liability Waivers",
        "Medical Records",
        "Policy & Rules",
        "Training Programs",
        "Other"
    ];

    const [touched, setTouched] = useState({
        documentName: false,
        category: false,
        notes: false,
        fileUrl: false,
    });

    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    const [errors, setErrors] = useState({});

    const [documentName, setDocumentName] = useState("");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [notes, setNotes] = useState("");
    const [fileUrl, setFileUrl] = useState(null);

    function validateField(name, value) {
        switch (name) {
            case "documentName":
                if (!value?.trim()) return "Document name is required.";
                return "";

            case "category":
                if (!value.trim()) return "Category is required.";
                if (value === "Other" && !customCategory.trim()) {
                    return "Please specify a custom category.";
                }
                return "";

            case "fileUrl":
                if (!value) return "A file is required.";
                return "";

            default:
                return "";
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
            documentName: true,
            category: true,
            notes: true,
            fileUrl: true
        };

        setTouched(newTouched);

        const newErrors = {
            documentName: validateField("documentName", documentName),
            category: validateField("category", category),
            notes: "",
            fileUrl: validateField("file", fileUrl)
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

        try {
            const finalCategory = category === "Other" ? customCategory.trim() : category;
            const formData = new FormData();
            formData.append("documentName", documentName);
            formData.append("category", finalCategory);
            formData.append("notes", notes);

            if (fileUrl) {
                formData.append("fileUrl", fileUrl);
            }

            const response = await fetch("http://localhost:8002/api/documents/", {
                method: "POST",
                body: formData
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Failed to add document.");
            }

            setSubmitStatus({
                type: "success",
                message: "Document submitted successfully."
            });

            setDocumentName("");
            setCategory("");
            setCustomCategory("");
            setNotes("");
            setFileUrl(null);

            setErrors({});
            setTouched({
                documentName: false,
                category: false,
                notes: false,
                file: false,
            });
        } catch (err) {
            console.error("Submit error:", err);
            setSubmitStatus({
                type: "error",
                message: err.message || "Something went wrong while uploading the document."
            });
        }
    }

    return (
        <div className="formContainer">
            <h2>Upload Document</h2>

            {submitStatus.message && (
                <div className={submitStatus.type === "success" ? "formAlert success" : "formAlert error"}>
                    {submitStatus.message}
                </div>
            )}

            <div className="formNote">
                Upload PDF or Word files so staff can reference them directly from the Documents page. Give each upload a clear name and category so it stays easy to find.
            </div>

            <form onSubmit={handleSubmit}>
                <div className="formInputs">
                    <div className="formSection">
                        <h3>File Details</h3>

                        <div className="inventory-form-row2">
                            <TextField
                                id="documentName"
                                label={<b>File Name: </b>}
                                placeholder="Enter file name"
                                value={documentName}
                                onChange={(value) =>
                                    updateField("documentName", value, setDocumentName, touched, setErrors, validateField)
                                }
                                icon_label="File name help"
                                title="File Name"
                                body="Use a short, descriptive name so staff can identify the document quickly. Avoid including file extensions or version numbers."
                                isRequired={true}
                                error={touched.documentName ? errors.documentName : ""}
                                onBlur={() =>
                                    handleBlur("documentName", documentName, setTouched, setErrors, validateField)
                                }
                            />

                            <DropdownField
                                id="category"
                                label={<b>Category: </b>}
                                options={documentCategories}
                                value={category}
                                onChange={(value) => {
                                    updateField("category", value, setCategory, touched, setErrors, validateField);

                                    if (value !== "Other") {
                                        setCustomCategory("");
                                    }
                                }}
                                allowCustom={true}
                                customLabel={<b>Specify Category: </b>}
                                customValue={customCategory}
                                onCustomChange={(value) => {
                                    setCustomCategory(value);

                                    if (touched.category) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            category: validateField("category", category)
                                        }));
                                    }
                                }}
                                icon_label="Category help"
                                title="Category"
                                body="Choose the closest match. Use Other only when the file does not fit an existing category."
                                isRequired={true}
                                error={touched.category ? errors.category : ""}
                                onBlur={() =>
                                    handleBlur("category", category, setTouched, setErrors, validateField)
                                }
                                touched={touched.category}
                            />
                        </div>

                        <div className="inventory-form-row3">
                            <TextAreaField
                                id="notes"
                                label={<b>Notes: </b>}
                                value={notes}
                                placeholder="Enter any additional information about this form."
                                onChange={(value) =>
                                    updateField("notes", value, setNotes, touched, setErrors, validateField)
                                }
                                maxLength={1000}
                                isRequired={false}
                                error={touched.notes ? errors.notes : ""}
                                onBlur={() =>
                                    handleBlur("notes", notes, setTouched, setErrors, validateField)
                                }
                                touched={touched.notes}
                            />
                        </div>
                    </div>

                    <div className="formSection">
                        <h3>Upload File</h3>

                        <div className="inventory-form-row3">
                            <UploadDocument
                                id="fileUrl"
                                label="Upload Document"
                                value={fileUrl}
                                onChange={(url) => updateField("fileUrl", url, setFileUrl, touched, setErrors, validateField)}
                                icon_label="Document upload help"
                                title="Document Upload"
                                body="Upload a PDF or Word document related to this form."
                                maxSizeMB={10}
                                onBlur={() => setTouched((prev) => ({ ...prev, fileUrl: true }))}
                                isRequired={false}
                                error={touched.fileUrl && !fileUrl ? "Please upload a document." : ""}
                            />
                        </div>
                    </div>

                    <div className="formButton">
                        <Button label="Cancel" variant="secondary" type="button" onClick={() => navigate(-1)} />
                        <Button label="Upload Document" type="submit" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddDocument;