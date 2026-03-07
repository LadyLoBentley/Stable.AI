import { useRef, useState, useEffect } from "react";
import InfoTip from '../InfoTip/InfoTip.jsx';

function UploadImage({
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
    const [previewUrl, setPreviewUrl] = useState("");
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (!value) {
            setPreviewUrl("");
            return;
        }

        const localUrl = URL.createObjectURL(value);
        setPreviewUrl(localUrl);

        return () => URL.revokeObjectURL(localUrl);
    }, [value]);

    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLocalError("");

        if (!file.type.startsWith("image/")) {
            setLocalError("Please upload a valid image file.");
            onChange(null);
            return;
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            setLocalError(`Image must be ${maxSizeMB} MB or smaller.`);
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
                    accept="image/*"
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

                {!previewUrl ? (
                    <label
                        htmlFor={id}
                        className={`uploadImageDropzone ${hasVisibleError ? "inputError" : ""}`}
                    >
                        <span className="uploadImageTitle">Choose an image</span>
                        <span className="uploadImageSubtext">
                            JPG, PNG, or WEBP up to {maxSizeMB} MB
                        </span>
                    </label>
                ) : (
                    <div
                        className={`uploadImagePreviewCard ${hasVisibleError ? "inputError" : ""}`}
                    >
                        <img
                            src={previewUrl}
                            alt="Selected inventory item"
                            className="uploadImagePreview"
                        />

                        <div className="uploadImageMeta">
                            <div className="uploadImageName">{value?.name}</div>
                            <div className="uploadImageSize">
                                {value ? (value.size / 1024 / 1024).toFixed(2) : "0.00"} MB
                            </div>
                        </div>

                        <div className="uploadImageActions">
                            <button
                                type="button"
                                className="uploadImageActionButton danger"
                                onClick={handleRemove}
                            >
                                Remove
                            </button>
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

export default UploadImage;