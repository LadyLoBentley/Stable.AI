import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import FormatDate from "../utils/FormatDate";
import TextField from "../components/Form/TextField.jsx";
import NumberField from "../components/Form/NumberField.jsx";
import DropdownField from "../components/Form/DropdownField.jsx";
import TextAreaField from "../components/Form/TextAreaField.jsx";
import UploadImage from "../components/Form/UploadImage.jsx";

const CATEGORY_OPTIONS = [
    "Hay",
    "Grain",
    "Treats",
    "Supplements",
    "Food Additive",
    "Electrolytes",
    "Medication",
    "Dewormer",
    "Grooming",
    "Barn Supplies",
    "Other"
];

const GRADE_OPTIONS = [
    "Premium",
    "Standard",
    "Economy",
    "Not Applicable"
];

async function readErrorMessage(response, fallbackMessage) {
    try {
        const data = await response.json();

        if (typeof data?.detail === "string") {
            return data.detail;
        }

        if (data?.detail) {
            return JSON.stringify(data.detail);
        }
    } catch {
        // Ignore parse errors and use fallback.
    }

    return fallbackMessage;
}

function buildInitialState(item) {
    return {
        label: item?.label || "",
        quantity: item?.quantity ?? 0,
        category: item?.category || "",
        grade: item?.grade || "",
        instructions: item?.instructions || ""
    };
}

function InventoryDetailPage() {
    const { item_id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        label: "",
        quantity: 0,
        category: "",
        grade: "",
        instructions: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });
    const categoryOptions =
        item?.category && !CATEGORY_OPTIONS.includes(item.category)
            ? [...CATEGORY_OPTIONS, item.category]
            : CATEGORY_OPTIONS;
    const gradeOptions =
        item?.grade && !GRADE_OPTIONS.includes(item.grade)
            ? [...GRADE_OPTIONS, item.grade]
            : GRADE_OPTIONS;

    async function fetchItem() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`http://127.0.0.1:8002/api/inventory/${item_id}`);

            if (!response.ok) {
                throw new Error("Failed to load inventory item.");
            }

            const data = await response.json();
            setItem(data);
            setFormData(buildInitialState(data));
        } catch (fetchError) {
            setError(fetchError.message || "Failed to load inventory item.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchItem();
    }, [item_id]);

    function updateField(fieldName, value) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitStatus({ type: "", message: "" });

        if (!formData.label.trim() || !formData.category.trim() || !formData.grade.trim() || !formData.instructions.trim()) {
            setSubmitStatus({
                type: "error",
                message: "Label, category, grade, and instructions are required."
            });
            return;
        }

        try {
            const payload = new FormData();
            payload.append("label", formData.label);
            payload.append("quantity", String(formData.quantity));
            payload.append("category", formData.category);
            payload.append("grade", formData.grade);
            payload.append("instructions", formData.instructions);

            if (imageFile) {
                payload.append("image", imageFile);
            }

            const response = await fetch(`http://127.0.0.1:8002/api/inventory/${item_id}`, {
                method: "PUT",
                body: payload
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to update inventory item."));
            }

            const updatedItem = await response.json();
            setItem(updatedItem);
            setFormData(buildInitialState(updatedItem));
            setImageFile(null);
            setIsEditing(false);
        } catch (saveError) {
            setSubmitStatus({
                type: "error",
                message: saveError.message || "Failed to update inventory item."
            });
        }
    }

    if (loading) return <p>Loading item...</p>;
    if (error) return <p>{error}</p>;
    if (!item) return <p>Item not found.</p>;

    return (
        <div className="formInputs">
            <div className="formContainer">
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        {submitStatus.message && (
                            <div className={submitStatus.type === "error" ? "formAlert error" : "formAlert success"}>
                                {submitStatus.message}
                            </div>
                        )}

                        <div className="formSection">
                            <h3>Edit Item Details</h3>
                            <div className="inventory-form-row2">
                                <TextField
                                    id="edit-item-label"
                                    label={<b>Item: </b>}
                                    value={formData.label}
                                    onChange={(value) => updateField("label", value)}
                                    isRequired={true}
                                />

                                <NumberField
                                    id="edit-item-quantity"
                                    label={<b>Quantity: </b>}
                                    value={formData.quantity}
                                    onChange={(value) => updateField("quantity", value)}
                                />
                            </div>

                            <div className="inventory-form-row2">
                                <DropdownField
                                    id="edit-item-category"
                                    label={<b>Category: </b>}
                                    options={categoryOptions}
                                    value={formData.category}
                                    onChange={(value) => updateField("category", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                />

                                <DropdownField
                                    id="edit-item-grade"
                                    label={<b>Grade: </b>}
                                    options={gradeOptions}
                                    value={formData.grade}
                                    onChange={(value) => updateField("grade", value)}
                                    allowCustom={false}
                                    isRequired={true}
                                />
                            </div>

                            <div className="inventory-form-row3">
                                <TextAreaField
                                    id="edit-item-instructions"
                                    label={<b>Instructions: </b>}
                                    value={formData.instructions}
                                    onChange={(value) => updateField("instructions", value)}
                                    maxLength={1000}
                                />
                            </div>
                        </div>

                        <div className="formSection">
                            <h3>Replace Image</h3>
                            <div className="existingAssetPreview">
                                <img src={item.image_url} alt={item.label} className="existingAssetImage" />
                            </div>

                            <div className="inventory-form-row4">
                                <UploadImage
                                    id="edit-item-image"
                                    label={<b>New Image (Optional): </b>}
                                    value={imageFile}
                                    onChange={setImageFile}
                                    maxSizeMB={5}
                                />
                            </div>
                        </div>

                        <div className="profileActionRow">
                            <button
                                type="button"
                                className="profileActionButton secondary"
                                onClick={() => {
                                    setFormData(buildInitialState(item));
                                    setImageFile(null);
                                    setSubmitStatus({ type: "", message: "" });
                                    setIsEditing(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="profileActionButton">
                                Save Item Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="profileSectionActions">
                            <button
                                type="button"
                                className="profileActionButton"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Inventory Item
                            </button>
                        </div>

                        <h2>{item.label}</h2>
                        <div className="imageContainer">
                            <img
                                className="displayImage"
                                src={item.image_url}
                                alt={item.label}
                            />
                        </div>

                        <div className="formSection">
                            <h3>Details</h3>
                            <dl className="detailList">
                                <div className="detailRow">
                                    <dt>Quantity</dt>
                                    <dd>{item.quantity} {item.unit}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Category</dt>
                                    <dd>{item.category}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Grade</dt>
                                    <dd>{item.grade}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Stock Status</dt>
                                    <dd>
                                        {(() => {
                                            const status = (item.stock_status || "").toLowerCase();
                                            const badgeClass =
                                                status.includes("out") || status.includes("low")
                                                    ? "warn"
                                                    : status.includes("in stock") || status.includes("ok")
                                                        ? ""
                                                        : "no";
                                            return (
                                                <span className={`detailBadge ${badgeClass}`}>
                                                    {item.stock_status}
                                                </span>
                                            );
                                        })()}
                                    </dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Date Added</dt>
                                    <dd>{FormatDate(item.created_at)}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Last Updated</dt>
                                    <dd>{FormatDate(item.updated_at)}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="formSection">
                            <h3>Instructions</h3>
                            <p className="instructionsText">{item.instructions}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default InventoryDetailPage;
