import { useRef, useState } from "react";
import InfoTip from "../InfoTip/InfoTip.jsx";
import Button from "../Button/Button.jsx";

function UploadDocument({
    id,
    label,
    value = null,
    onChange,
    icon_label,
    title,
    body,
    maxSizeMB = 10,
    onBlur,
    isRequired = false,
    error = ""
}) {
    const inputRef = useRef(null);
    const [localError, setLocalError] = useState("");

    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLocalError("");

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setLocalError("Please upload a PDF, Word document, or image.");
            onChange(null);
            return;
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            setLocalError(`File must be ${maxSizeMB} MB or smaller.`);
            onChange(null);
            return;
        }

        onChange(file);
    }

    function handleRemove() {
        setLocalError("");
        onChange(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const hasVisibleError = !!error || !!localError;

    return (
        <div className="fieldWrapper">
            <label htmlFor={id} className="uploadImageLabelRow">
                <span className="field-label">
                    {label}
                    {isRequired && <span className="requiredMark">*</span>}
                    <InfoTip
                        label={icon_label}
                        title={title}
                        body={body}
                    />
                </span>
            </label>

            <div className="uploadImageBox">
                <input
                    ref={inputRef}
                    id={id}
                    name={id}
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onBlur={onBlur}
                    onChange={handleFileSelect}
                    className="uploadImageInput"
                    aria-invalid={hasVisibleError}
                    aria-describedby={
                        error
                            ? `${id}-error`
                            : localError
                                ? `${id}-local-error`
                                : undefined
                    }
                />

                {!value ? (
                    <label
                        htmlFor={id}
                        className={`uploadImageDropzone ${hasVisibleError ? "inputError" : ""}`}
                    >
                        <span className="uploadImageTitle">Choose a document</span>
                        <span className="uploadImageSubtext">
                            PDF, DOC, DOCX, JPG, PNG, or WEBP up to {maxSizeMB} MB
                        </span>
                    </label>
                ) : (
                    <div
                        className={`uploadImagePreviewCard ${hasVisibleError ? "inputError" : ""}`}
                    >
                        <div className="uploadPdfPreview">
                            <span className="uploadPdfIcon">📄</span>
                            <span className="uploadPdfText">Document selected</span>
                        </div>

                        <div className="uploadImageMeta">
                            <div className="uploadImageName">{value?.name}</div>
                            <div className="uploadImageSize">
                                {value ? (value.size / 1024 / 1024).toFixed(2) : "0.00"} MB
                            </div>
                        </div>

                        <div className="uploadImageActions">
                            <Button
                                type="button"
                                className="uploadImageActionButton danger"
                                onClick={handleRemove}
                                label="Remove"
                            />
                        </div>
                    </div>
                )}

                {localError && (
                    <div id={`${id}-local-error`} className="fieldError">
                        {localError}
                    </div>
                )}

                {error && (
                    <div id={`${id}-error`} className="fieldError">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadDocument;
