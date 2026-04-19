export function normalizeScheduleDetails(details) {
    return {
        daysOfWeek: Array.isArray(details?.daysOfWeek) ? details.daysOfWeek : [],
        daysOfMonth: Array.isArray(details?.daysOfMonth) ? details.daysOfMonth : [],
        yearlyMonthDays: Array.isArray(details?.yearlyMonthDays) ? details.yearlyMonthDays : []
    };
}

export function mapCareResponseToEntry(item, nameField, idField) {
    return {
        id: item[idField] || crypto.randomUUID(),
        itemName: item[nameField] || "",
        dosageAmount: item.dosage_amount || "",
        dosageUnit: item.dosage_unit || "",
        administrationTimes: Array.isArray(item.administration_times) ? item.administration_times : [],
        frequencyType: item.frequency_type || "",
        singleDoseDate: item.single_dose_date || "",
        scheduleDetails: normalizeScheduleDetails(item.schedule_details),
        notes: item.notes || ""
    };
}

export function sanitizeCareEntries(entries = []) {
    return entries.map((entry) => ({
        itemName: entry.itemName || "",
        dosageAmount: entry.dosageAmount || "",
        dosageUnit: entry.dosageUnit || "",
        administrationTimes: Array.isArray(entry.administrationTimes) ? entry.administrationTimes : [],
        frequencyType: entry.frequencyType || "",
        singleDoseDate: entry.singleDoseDate || null,
        scheduleDetails: normalizeScheduleDetails(entry.scheduleDetails),
        notes: entry.notes || null
    }));
}

export function formatAdministrationTimes(times) {
    if (!times || !Array.isArray(times) || times.length === 0) {
        return null;
    }

    return times.join(", ");
}

export function formatScheduleDetails(details, frequencyType) {
    if (!details || typeof details !== "object") {
        return null;
    }

    if (frequencyType === "Weekly") {
        if (Array.isArray(details.daysOfWeek) && details.daysOfWeek.length > 0) {
            return `Days: ${details.daysOfWeek.join(", ")}`;
        }
        return null;
    }

    if (frequencyType === "Monthly") {
        if (Array.isArray(details.daysOfMonth) && details.daysOfMonth.length > 0) {
            return `Days: ${details.daysOfMonth.join(", ")}`;
        }
        return null;
    }

    if (frequencyType === "Yearly") {
        if (Array.isArray(details.yearlyMonthDays) && details.yearlyMonthDays.length > 0) {
            const validDates = details.yearlyMonthDays
                .filter((item) => item.month && item.day)
                .map((item) => `${item.month}/${item.day}`);

            return validDates.length > 0 ? validDates.join(", ") : null;
        }
        return null;
    }

    return null;
}

export function formatDosage(amount, unit) {
    if (!amount && !unit) {
        return null;
    }

    if (amount && !unit) {
        return String(amount);
    }

    if (!amount && unit) {
        return unit === "Other" ? null : unit;
    }

    if (unit === "Other") {
        return `${amount}`;
    }

    return `${amount} ${unit}`;
}
