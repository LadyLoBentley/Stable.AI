import InfoTip from "../InfoTip/InfoTip.jsx";

function DropdownField({
                           id,
                           label,
                           options,
                           value,
                           onChange,
                           allowCustom = false,
                           customLabel,
                           customValue = "",
                           onCustomChange,
                           icon_label,
                           title,
                           body,
                           isRequired = false,
                           error = "",
                           onBlur
}) {

  function handleSelectChange(e) {
      onChange(e.target.value);
  }

  function handleCustomChange(e) {
      if (onCustomChange) onCustomChange(e.target.value);
  }

  const showCustomField = allowCustom && value === "Other";

  return (
      <div className="dropdownFieldGroup">
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

          <select
              id={id}
              name={id}
              value={value}
              onChange={handleSelectChange}
              onBlur={onBlur}
              className={error ? "inputError" : ""}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
          >
              <option value="">Select an option</option>
              {options.map((option) => (
                  <option key={option} value={option}>
                      {option}
                  </option>
              ))}
          </select>

          {error && (
                <div id={`${id}-error`} className="fieldError">
                    {error}
                </div>
          )}

          {showCustomField && (
              <div className="customFieldBlock">
                  <label htmlFor={`${id}-custom`}>
                      <span className="field-label">
                          {customLabel}
                      </span>
                  </label>

              <input
                  type="text"
                  id={`${id}-custom`}
                  name={`${id}-custom`}
                  placeholder="Enter category"
                  value={customValue}
                  onChange={handleCustomChange}
                  onBlur={onBlur}
              />
          </div>
      )}
    </div>
  );
}

export default DropdownField;