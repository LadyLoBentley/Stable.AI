import InfoTip from "../InfoTip/InfoTip.jsx";

function NumberField({
    id,
    label,
    value,
    placeholder,
    onChange,
    icon_label,
    title,
    body,
    isRequired = false,
    step = "any",
    min = 0,
    error = "",
    onBlur
}) {
    function handleNumberChange(e) {
        const newValue = e.target.value;

        if (newValue === "") {
            onChange("");
            return;
        }

        if (Number(newValue) < min) return;

        onChange(newValue);
    }

    return (
        <div className="fieldWrapper">
            <label htmlFor={id}>
                <span className="field-label">
                    {label}
                    {isRequired && <span className="requiredMark">*</span>}
                    {(icon_label || title || body) && (
                        <InfoTip
                            label={icon_label}
                            title={title}
                            body={body}
                        />
                    )}
                </span>
            </label>

            <input
                type="number"
                id={id}
                name={id}
                placeholder={placeholder}
                min={min}
                step={step}
                value={value ?? ""}
                onChange={handleNumberChange}
                onBlur={onBlur}
                className={error ? "inputError" : ""}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                required={isRequired}
            />

            {error && (
                <div id={`${id}-error`} className="fieldError">
                    {error}
                </div>
            )}
        </div>
    );
}

export default NumberField;