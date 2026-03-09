
export function handleBlur(
    fieldName,
    value,
    setTouched,
    setErrors,
    validateField
) {

    setTouched((prev) => ({
        ...prev,
        [fieldName]: true
    }));

    setErrors((prev) => ({
        ...prev,
        [fieldName]: validateField(fieldName, value)
    }));
}

export function updateField(
    fieldName,
    value, setter,
    touched,
    setErrors,
    validateField
) {

    setter(value);

    if (touched[fieldName]) {
        setErrors((prev) => ({
            ...prev,
            [fieldName]: validateField(fieldName, value)
        }));
    }
}