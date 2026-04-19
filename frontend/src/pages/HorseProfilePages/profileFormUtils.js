export function toDateInputValue(value) {
    if (!value) {
        return "";
    }

    return String(value).slice(0, 10);
}

export async function readErrorMessage(response, fallbackMessage) {
    try {
        const data = await response.json();

        if (typeof data?.detail === "string") {
            return data.detail;
        }

        if (data?.detail) {
            return JSON.stringify(data.detail);
        }
    } catch {
        // Ignore JSON parsing failures and use the fallback message.
    }

    return fallbackMessage;
}
