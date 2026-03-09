import InfoTip from "../InfoTip/InfoTip.jsx";

function CheckboxField({
    id,
    label,
    checked,
    onChange,
    icon_label,
    title,
    body,
    isRequired = false,
    error = "",
    onBlur
}) {

    function handleCheckboxChange(e) {
        onChange(e.target.checked);
    }

    return (
        <div className="fieldWrapper checkboxFieldWrapper">
            <div className="checkboxRow">
                <input
                    type="checkbox"
                    id={id}
                    name={id}
                    checked={checked}
                    onChange={handleCheckboxChange}
                    onBlur={onBlur}
                    className={`checkboxInput ${error ? "inputError" : ""}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />

                <label htmlFor={id}>
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
            </div>

            {error && (
                <div id={`${id}-error`} className="fieldError">
                    {error}
                </div>
            )}
        </div>
    );
}

export default CheckboxField;