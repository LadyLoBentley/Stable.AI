import { useRef, useEffect } from "react";
import InfoTip from '../InfoTip/InfoTip.jsx';

function TextAreaField({
                           id,
                           label,
                           value,
                           placeholder,
                           onChange,
                           maxLength = 500,
                           icon_label,
                           title,
                           body,
                           isRequired = false,
                           error = "",
                           onBlur,
                           touched
}) {
    const textareaRef = useRef(null);
    const charCount = value.length;

    const handleInstructionChange = (e) => {
        onChange(e.target.value);
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }, [value]);

    let countClass = "charCount";

    if (touched) {
        if (charCount >= maxLength) {
            countClass = "charCount danger";
        } else if (charCount >= maxLength * 0.9) {
            countClass = "charCount warning";
        } else {
            countClass = "charCount good";
        }
    }
    return (
        <div className="fieldWrapper">
            <label htmlFor={id} className="textareaLabelRow">
                <span className="field-label">
                    {label}
                    {isRequired && <span className="requiredMark">*</span>}
                    <InfoTip
                        label={icon_label}
                        title={title}
                        body={body}
                    />
                </span>

                <span className={countClass}>
                    {charCount} / {maxLength}
                </span>
            </label>

            <textarea
                ref={textareaRef}
                id={id}
                name={id}
                value={value}
                placeholder={placeholder}
                onChange={handleInstructionChange}
                onBlur={onBlur}
                maxLength={maxLength}
                className={`autoExpand ${error ? "inputError" : ""}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${error}` : undefined}
            />

            {error && (
                <div id={`${id}-error`} className="fieldError">
                    {error}
                </div>
            )}
        </div>
    );
}

export default TextAreaField;