import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DropdownField from "../components/Form/DropdownField.jsx";
import TextAreaField from "../components/Form/TextAreaField.jsx";
import TextField from "../components/Form/TextField.jsx";
import UploadDocument from "../components/Form/UploadDocument.jsx";
import FormatDate from "../utils/FormatDate.jsx";
import { DOCUMENT_CATEGORIES, readErrorMessage } from "./documentUtils.js";

function buildEditorState(document) {
    return {
        documentName: document?.document_name || "",
        category: document?.category || "",
        notes: document?.notes || ""
    };
}

function DocumentDetailPage() {
    const { document_id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editorState, setEditorState] = useState({
        documentName: "",
        category: "",
        notes: ""
    });
    const [replacementFile, setReplacementFile] = useState(null);
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });

    const documentCategoryOptions = useMemo(() => {
        if (document?.category && !DOCUMENT_CATEGORIES.includes(document.category)) {
            return [...DOCUMENT_CATEGORIES, document.category];
        }

        return DOCUMENT_CATEGORIES;
    }, [document?.category]);

    useEffect(() => {
        setEditorState(buildEditorState(document));
        setReplacementFile(null);
        setSubmitStatus({ type: "", message: "" });
    }, [document?.document_id]);

    useEffect(() => {
        async function fetchDocument() {
            try {
                setLoading(true);
                setError("");

                const byIdResponse = await fetch(`http://127.0.0.1:8002/api/documents/${document_id}`);

                if (byIdResponse.ok) {
                    const byIdData = await byIdResponse.json();
                    setDocument(byIdData);
                    return;
                }

                const listResponse = await fetch("http://127.0.0.1:8002/api/documents/");
                if (!listResponse.ok) {
                    throw new Error("Failed to load document.");
                }

                const documents = await listResponse.json();
                const matchedDocument = Array.isArray(documents)
                    ? documents.find((item) => item.document_id === document_id)
                    : null;

                if (!matchedDocument) {
                    throw new Error("Document not found.");
                }

                setDocument(matchedDocument);
            } catch (fetchError) {
                setError(fetchError.message || "Failed to load document.");
            } finally {
                setLoading(false);
            }
        }

        fetchDocument();
    }, [document_id]);

    function updateField(fieldName, value) {
        setEditorState((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    }

    async function handleSave(event) {
        event.preventDefault();

        if (!document) {
            return;
        }

        if (!editorState.documentName.trim() || !editorState.category.trim()) {
            setSubmitStatus({
                type: "error",
                message: "Document name and category are required."
            });
            return;
        }

        try {
            const payload = new FormData();
            payload.append("documentName", editorState.documentName.trim());
            payload.append("category", editorState.category.trim());
            payload.append("notes", editorState.notes || "");

            if (replacementFile) {
                payload.append("fileUrl", replacementFile);
            }

            const response = await fetch(
                `http://127.0.0.1:8002/api/documents/${document.document_id}`,
                {
                    method: "PUT",
                    body: payload
                }
            );

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to update document."));
            }

            const updatedDocument = await response.json();
            setDocument(updatedDocument);
            setEditorState(buildEditorState(updatedDocument));
            setReplacementFile(null);
            setSubmitStatus({
                type: "success",
                message: "Document updated successfully."
            });
        } catch (saveError) {
            setSubmitStatus({
                type: "error",
                message: saveError.message || "Failed to update document."
            });
        }
    }

    async function handleRemove() {
        if (!document) {
            return;
        }

        const confirmed = window.confirm(`Remove "${document.document_name}"?`);
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8002/api/documents/${document.document_id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to remove document."));
            }

            navigate("/documents", { replace: true });
        } catch (removeError) {
            setSubmitStatus({
                type: "error",
                message: removeError.message || "Failed to remove document."
            });
        }
    }

    if (loading) {
        return <p className="pageMessage">Loading document...</p>;
    }

    if (error) {
        return <p className="pageMessage errorMessage">{error}</p>;
    }

    if (!document) {
        return <p className="pageMessage">Document not found.</p>;
    }

    return (
        <div className="formInputs">
            <div className="formContainer">
                <div className="profileActionRow">
                    <Link to="/documents" className="profileActionButton secondary pageActionLink">
                        Back to Documents
                    </Link>
                </div>

                <h2>Document Manager</h2>

                {submitStatus.message && (
                    <div className={submitStatus.type === "error" ? "formAlert error" : "formAlert success"}>
                        {submitStatus.message}
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <div className="formSection">
                        <h3>Selected Document</h3>
                        <dl className="detailList">
                            <div className="detailRow wide">
                                <dt>File Name</dt>
                                <dd>{document.document_name}</dd>
                            </div>
                            <div className="detailRow">
                                <dt>Uploaded</dt>
                                <dd>{FormatDate(document.created_at)}</dd>
                            </div>
                            <div className="detailRow">
                                <dt>Updated</dt>
                                <dd>{FormatDate(document.updated_at)}</dd>
                            </div>
                            {document.category && (
                                <div className="detailRow">
                                    <dt>Category</dt>
                                    <dd>
                                        <span className="detailBadge">{document.category}</span>
                                    </dd>
                                </div>
                            )}
                            {document.file_url && (
                                <div className="detailRow wide">
                                    <dt>Current File</dt>
                                    <dd>
                                        <a href={document.file_url} target="_blank" rel="noreferrer">
                                            Open document in a new tab
                                        </a>
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {document.file_url?.match(/\.(jpg|jpeg|png|webp)$/i) && (
                            <div className="existingAssetPreview">
                                <img
                                    src={document.file_url}
                                    alt={document.document_name}
                                    className="existingAssetImage"
                                />
                            </div>
                        )}

                        {document.file_url?.match(/\.pdf$/i) && (
                            <div className="documentPreviewFrameWrap">
                                <iframe
                                    src={document.file_url}
                                    title={`${document.document_name} preview`}
                                    className="documentPreviewFrame"
                                />
                            </div>
                        )}
                    </div>

                    <div className="formSection">
                        <h3>Edit Metadata</h3>
                        <div className="inventory-form-row2">
                            <TextField
                                id="document-editor-name"
                                label={<b>File Name: </b>}
                                value={editorState.documentName}
                                onChange={(value) => updateField("documentName", value)}
                                isRequired={true}
                            />

                            <DropdownField
                                id="document-editor-category"
                                label={<b>Category: </b>}
                                options={documentCategoryOptions}
                                value={editorState.category}
                                onChange={(value) => updateField("category", value)}
                                allowCustom={false}
                                isRequired={true}
                            />
                        </div>

                        <div className="inventory-form-row3">
                            <TextAreaField
                                id="document-editor-notes"
                                label={<b>Notes: </b>}
                                value={editorState.notes}
                                onChange={(value) => updateField("notes", value)}
                                maxLength={1000}
                            />
                        </div>

                        <div className="inventory-form-row4">
                            <UploadDocument
                                id="document-editor-file"
                                label="Replace File (Optional)"
                                value={replacementFile}
                                onChange={setReplacementFile}
                                maxSizeMB={10}
                            />
                        </div>
                    </div>

                    <div className="profileActionRow">
                        <button type="submit" className="profileActionButton">
                            Save Document Changes
                        </button>
                        <button
                            type="button"
                            className="profileActionButton danger"
                            onClick={handleRemove}
                        >
                            Remove Document
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DocumentDetailPage;
