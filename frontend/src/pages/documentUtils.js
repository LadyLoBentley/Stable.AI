export const DOCUMENT_CATEGORIES = [
    "Barn Information",
    "Blank Templates",
    "Boarding Agreements",
    "Care Instructions",
    "Competition Records",
    "Invoice & Billing",
    "Lesson Agreements",
    "Liability Waivers",
    "Medical Records",
    "Policy & Rules",
    "Training Programs",
    "Other"
];

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
        // Use fallback when JSON parsing fails.
    }

    return fallbackMessage;
}
