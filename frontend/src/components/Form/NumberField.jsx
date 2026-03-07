import InfoTip from '../InfoTip/InfoTip.jsx';

function NumberField({
                         id,
                         label,
                         value,
                         placeholder,
                         onChange,
                         icon_label,
                         title,
                         body
}) {

    function handleNumberChange(e) {
        const value = Number(e.target.value);

        if (value < 0) return;
        onChange(value);
    }

    return (
        <div className="fieldWrapper">
        <label htmlFor={id}>
            <span className="field-label">
                {label}
                <InfoTip
                    label={icon_label}
                    title={title}
                    body={body}
                />
            </span>
        </label>
            <input
                type="number"
                id={id}
                name={label}
                placeholder={placeholder}
                min={0}
                value={value}
                onChange={handleNumberChange}
            />
        </div>
    );
}

export default NumberField;