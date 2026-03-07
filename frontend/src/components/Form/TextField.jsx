import InfoTip from '../InfoTip/InfoTip.jsx';

function TextField({
                       id,
                       label,
                       placeholder,
                       value,
                       onChange,
                       icon_label,
                       title,
                       body,
                       isRequired = false,
                       error = "",
                       onBlur
}) {

    function handleTextChange(e) {
        onChange(e.target.value);
    }

    return (
        <div className="fieldWrapper">
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
            <input
                type="text"
                id={id}
                name={label}
                placeholder={placeholder}
                value={value}
                onChange={handleTextChange}
                onBlur={onBlur}
                className={error ? "inputError" : ""}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error`:undefined}
            />

            {error && (
                <div id={`${id}-error`} className="fieldError">
                    {error}
                </div>
            )}
        </div>
    );
}

export default TextField;