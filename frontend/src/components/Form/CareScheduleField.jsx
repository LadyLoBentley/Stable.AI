import { useState } from "react";
import TextField from "./TextField.jsx";
import DropdownField from "./DropdownField.jsx";
import CheckboxField from "./CheckBox.jsx";
import TextAreaField from "./TextAreaField.jsx";

function ActionButton({ children, onClick, type = "button", variant = "primary" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`scheduleActionButton ${variant}`}
        >
            {children}
        </button>
    );
}

function InlineTextButton({ children, onClick, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="scheduleInlineButton"
        >
            {children}
        </button>
    );
}

function createEmptyEntry() {
    return {
        itemName: "",
        condition: "",
        dosage: "",
        administrationTimes: [],
        frequencyType: "",
        scheduleDetails: {
        daysOfWeek: [],
        daysOfMonth: [],
        yearlyMonthDays: [{ month: "", day: "" }]
     },
        notes: ""
    };
}

function CareScheduleField({
    label,
    value = [],
    onChange,
    itemOptions = [],
    itemTipTitle,
    itemTipBody,
    tipDosageTitle,
    tipDosageBody,
    tipFrequencyTitle,
    tipFrequencyBody,
    tipAmTitle,
    tipAmBody,
    tipPmTitle,
    tipPmBody,
    tipNotesTitle,
    tipNotesBody
}) {

    const [entry, setEntry] = useState(createEmptyEntry());
    const [error, setError] = useState("");

    const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];

    const weekOptions = [
        "Mon","Tue","Wed","Thu","Fri","Sat","Sun"
    ];

    const monthOptions = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    function handleFrequencyChange(newFrequency) {
        setEntry(prev => ({
            ...prev,
            frequencyType: newFrequency,
            scheduleDetails: {
                daysOfWeek:
                    newFrequency === "Weekly"
                        ? prev.scheduleDetails.daysOfWeek
                        : [],

                daysOfMonth:
                    newFrequency === "Monthly"
                        ? prev.scheduleDetails.daysOfMonth
                        : [],

                yearlyMonthDays:
                    newFrequency === "Yearly"
                        ? prev.scheduleDetails.yearlyMonthDays.length
                            ? prev.scheduleDetails.yearlyMonthDays
                            : [{ month: "", day: "" }]
                        : [{ month: "", day: "" }]
            }
        }));
    }

    function updateField(field, newValue) {
        setEntry(prev => ({
            ...prev,
            [field]: newValue
        }));
    }

    function toggleAdministrationTime(time) {
        setEntry(prev => {

            const exists =
                prev.administrationTimes.includes(time);

            return {
                ...prev,

                administrationTimes:
                    exists
                        ? prev.administrationTimes.filter(t => t !== time)
                        : [...prev.administrationTimes, time]
            };
        });
    }

    function toggleDayOfWeek(day) {
        setEntry(prev => {

            const exists =
                prev.scheduleDetails.daysOfWeek.includes(day);

            return {
                ...prev,

                scheduleDetails: {
                    ...prev.scheduleDetails,

                    daysOfWeek:
                        exists
                            ? prev.scheduleDetails.daysOfWeek.filter(d => d !== day)
                            : [...prev.scheduleDetails.daysOfWeek, day]
                }
            };
        });
    }

    function toggleDayOfMonth(day) {
        setEntry(prev => {

            const exists =
                prev.scheduleDetails.daysOfMonth.includes(day);

            return {
                ...prev,

                scheduleDetails: {
                    ...prev.scheduleDetails,

                    daysOfMonth:
                        exists
                            ? prev.scheduleDetails.daysOfMonth.filter(d => d !== day)
                            : [...prev.scheduleDetails.daysOfMonth, day]
                }
            };
        });
    }

    function updateYearlyMonthDay(index, field, newValue) {

        setEntry(prev => {

            const updated =
                [...prev.scheduleDetails.yearlyMonthDays];

            updated[index] = {
                ...updated[index],
                [field]: newValue
            };

            return {
                ...prev,

                scheduleDetails: {
                    ...prev.scheduleDetails,
                    yearlyMonthDays: updated
                }
            };
        });
    }

    function addYearlyMonthDayRow() {
        setEntry(prev => ({
            ...prev,

            scheduleDetails: {
                ...prev.scheduleDetails,

                yearlyMonthDays: [
                    ...prev.scheduleDetails.yearlyMonthDays,
                    { month: "", day: "" }
                ]
            }
        }));
    }

    function removeYearlyMonthDayRow(index) {

        setEntry(prev => {

            const updated =
                prev.scheduleDetails.yearlyMonthDays
                    .filter((_, i) => i !== index);

            return {
                ...prev,

                scheduleDetails: {
                    ...prev.scheduleDetails,

                    yearlyMonthDays:
                        updated.length
                            ? updated
                            : [{ month: "", day: "" }]
                }
            };
        });
    }

    function isEntryBlank() {
        return (
            !entry.itemName.trim() &&
            !entry.dosage.trim() &&
            !entry.frequencyType &&
            entry.administrationTimes.length === 0 &&
            entry.scheduleDetails.daysOfWeek.length === 0 &&
            entry.scheduleDetails.daysOfMonth.length === 0 &&
            entry.scheduleDetails.yearlyMonthDays.every(
                (row) => !row.month && !row.day
            ) &&
            !entry.notes.trim()
        );
    }


    function validateEntry() {

        if (!entry.itemName.trim())
            return "Item required";

        if (!entry.dosage.trim())
            return "Dosage required";

        if (!entry.administrationTimes.length)
            return "Select AM or PM";

        if (!entry.frequencyType)
            return "Frequency required";

        if (
            entry.frequencyType === "Weekly" &&
            !entry.scheduleDetails.daysOfWeek.length
        ) {
            return "Select weekly days";
        }

        if (
            entry.frequencyType === "Monthly" &&
            !entry.scheduleDetails.daysOfMonth.length
        ) {
            return "Select monthly days";
        }

        if (entry.frequencyType === "Yearly") {

            const valid =
                entry.scheduleDetails.yearlyMonthDays
                    .filter(row => row.month && row.day);

            if (!valid.length)
                return "Add yearly date";
        }

        return "";
    }

    function handleAddEntry() {
        if (isEntryBlank()) {
            setError("");
            return;
        }

        const validationError = validateEntry();

        if (validationError) {
            setError(validationError);
            return;
        }

        const cleanedEntry = {
            ...entry,
            id: crypto.randomUUID(),
            scheduleDetails: {
                daysOfWeek:
                    entry.frequencyType === "Weekly"
                        ? entry.scheduleDetails.daysOfWeek
                        : [],

                daysOfMonth:
                    entry.frequencyType === "Monthly"
                        ? entry.scheduleDetails.daysOfMonth
                        : [],

                yearlyMonthDays:
                    entry.frequencyType === "Yearly"
                        ? entry.scheduleDetails.yearlyMonthDays.filter(
                              (row) => row.month && row.day
                          )
                        : []
            }
        };

        onChange([...value, cleanedEntry]);
        setEntry(createEmptyEntry());
        setError("");
    }

    function handleRemoveEntry(id) {

        onChange(
            value.filter(item => item.id !== id)
        );
    }

    return (


        <div className="careScheduleField">

            <div className="sectionHeader">
                <h3>{label}</h3>
            </div>

            {error && (
                <div className="formAlert error">
                    {error}
                </div>
            )}

            {/* BASIC INFO */}

            <div className="inventory-form-row2">

                <DropdownField
                    id={`${label}-item`}
                    label={<b>Item</b>}
                    options={itemOptions}
                    value={entry.itemName}
                    onChange={(val)=>updateField("itemName",val)}
                    allowCustom={true}
                    title={itemTipTitle}
                    body={itemTipBody}
                />

                <TextField
                    id={`${label}-dosage`}
                    label={<b>Dosage</b>}
                    placeholder="Example: 2 tablets"
                    value={entry.dosage}
                    onChange={(val)=>updateField("dosage",val)}
                    title={tipDosageTitle}
                    body={tipDosageBody}
                />

            </div>

            {/* SCHEDULE BOX */}

            <div className="scheduleBox">

                <DropdownField
                    id={`${label}-frequency`}
                    label={<b>Frequency</b>}
                    options={frequencyOptions}
                    value={entry.frequencyType}
                    onChange={handleFrequencyChange}
                    allowCustom={false}
                    title={tipFrequencyTitle}
                    body={tipFrequencyBody}
                />

                <div className="timeRow">

                    <CheckboxField
                        id={`${label}-am`}
                        label="AM"
                        checked={
                            entry.administrationTimes.includes("AM")
                        }
                        onChange={()=>toggleAdministrationTime("AM")}
                        title={tipAmTitle}
                        body={tipAmBody}
                    />

                    <CheckboxField
                        id={`${label}-pm`}
                        label="PM"
                        checked={
                            entry.administrationTimes.includes("PM")
                        }
                        onChange={()=>toggleAdministrationTime("PM")}
                        title={tipPmTitle}
                        body={tipPmBody}
                    />

                </div>


                {entry.frequencyType==="Weekly" && (

                    <>
                        <label className="scheduleLabel">
                            Days of Week
                        </label>

                        <div className="scheduleDaysGrid">

                            {weekOptions.map(day=>(

                                <label key={day} className="dayCheck">

                                    <CheckboxField
                                        id={`${label}-${day}`}
                                        checked={
                                            entry.scheduleDetails.daysOfWeek.includes(day)
                                        }
                                        onChange={()=>toggleDayOfWeek(day)}
                                    />

                                    <span>{day}</span>

                                </label>

                            ))}

                        </div>

                    </>

                )}


                {entry.frequencyType==="Monthly" && (

                    <>
                        <label className="scheduleLabel">
                            Days of Month
                        </label>

                        <div className="scheduleDaysGrid">

                            {Array.from({length:31},(_,i)=>i+1).map(day=>(

                                <label key={day} className="dayCheck">

                                    <CheckboxField
                                        id={`${label}-day-${day}`}
                                        checked={
                                            entry.scheduleDetails.daysOfMonth.includes(day)
                                        }
                                        onChange={()=>toggleDayOfMonth(day)}
                                    />

                                    <span>{day}</span>

                                </label>

                            ))}

                        </div>

                    </>

                )}

                {entry.frequencyType === "Yearly" && (
                    <>
                        <label className="scheduleLabel">Yearly Date(s)</label>

                        <div className="yearlyScheduleList">
                            {entry.scheduleDetails.yearlyMonthDays.map((row, index) => (
                                <div key={index} className="yearlyScheduleRow">
                                    <DropdownField
                                        id={`${label}-yearly-month-${index}`}
                                        label={<b>Month</b>}
                                        options={monthOptions}
                                        value={row.month}
                                        onChange={(val) => updateYearlyMonthDay(index, "month", val)}
                                        allowCustom={false}
                                    />

                                    <DropdownField
                                        id={`${label}-yearly-day-${index}`}
                                        label={<b>Day</b>}
                                        options={Array.from({ length: 31 }, (_, i) => String(i + 1))}
                                        value={row.day}
                                        onChange={(val) => updateYearlyMonthDay(index, "day", val)}
                                        allowCustom={false}
                                    />

                                   <div className="yearlyRemoveWrap">
                                        {entry.scheduleDetails.yearlyMonthDays.length > 1 && (
                                            <InlineTextButton onClick={() => removeYearlyMonthDayRow(index)}>
                                                Remove
                                            </InlineTextButton>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                       <div className="yearlyAddButton">
                            <InlineTextButton onClick={addYearlyMonthDayRow}>
                                + Add another date
                            </InlineTextButton>
                        </div>
                    </>
                )}
            </div>


            {/* NOTES */}

            <div className="inventory-form-row4">

                <TextAreaField
                    id={`${label}-notes`}
                    label={<b>Notes</b>}
                    value={entry.notes}
                    placeholder="Optional notes"
                    onChange={(val)=>updateField("notes",val)}
                    maxLength={500}
                    title={tipNotesTitle}
                    body={tipNotesBody}
                />

            </div>


            {/* ADD BUTTON */}

            <div className="scheduleAdd">
                <ActionButton onClick={handleAddEntry}>
                    Add {label === "Medications" ? "Medication" : "Supplement"}
                </ActionButton>
            </div>


            {/* SAVED ENTRIES */}

            {!!value.length && (

                <div className="careScheduleList">

                    <h4 className="scheduleListTitle">
                        Scheduled {label}
                    </h4>

                    {value.map(item=>(

                        <div
                            key={item.id}
                            className="careScheduleCard"
                        >
                            <div className="careScheduleCardHeader">
                                <p className="careScheduleItemName">{item.itemName}</p>

                                <InlineTextButton onClick={() => handleRemoveEntry(item.id)}>
                                    Remove
                                </InlineTextButton>
                            </div>

                            <p className="careScheduleMeta">
                                {item.dosage} • {item.administrationTimes.join(", ")} • {item.frequencyType}
                            </p>

                            {item.notes && (
                                <p className="scheduleNotes">
                                    {item.notes}
                                </p>
                            )}
                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default CareScheduleField;