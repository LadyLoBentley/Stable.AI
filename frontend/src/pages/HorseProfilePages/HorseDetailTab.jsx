import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import FormatDate from "../../utils/FormatDate";
import HorseDetailEditForm from "./HorseDetailEditForm.jsx";

function HorseDetailTab() {
    const { horse, setHorse, setHeaderAction } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        type: "",
        message: ""
    });
    const navigate = useNavigate();

    async function readErrorMessage(response, fallbackMessage) {
        const errorData = await response.json().catch(() => ({}));
        const detail = errorData?.detail;

        if (typeof detail === "string") {
            return detail;
        }

        if (Array.isArray(detail)) {
            return detail
                .map((item) => item?.msg || JSON.stringify(item))
                .join("; ");
        }

        return fallbackMessage;
    }

    function handleSaved(updatedHorse) {
        setHorse(updatedHorse);
        setIsEditing(false);
        setSubmitStatus({
            type: "success",
            message: "Horse details updated successfully."
        });
    }

    async function handleDeleteHorse() {
        const confirmed = window.confirm(
            `Delete "${horse.horse_name}"? This will permanently remove the horse profile, medical history, feed plan, medications, supplements, and related care records.`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8002/api/horses/${horse.horse_id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Failed to delete horse."));
            }

            navigate("/", { replace: true });
        } catch (deleteError) {
            setSubmitStatus({
                type: "error",
                message: deleteError.message || "Failed to delete horse."
            });
        }
    }

    useEffect(() => {
        if (isEditing) {
            setHeaderAction(null);
            return;
        }

        setHeaderAction([
            {
                key: "delete-horse",
                label: "Delete Horse",
                variant: "danger",
                onClick: handleDeleteHorse
            },
            {
                key: "edit-horse-details",
                label: "Edit Horse Details",
                onClick: () => setIsEditing(true)
            }
        ]);

        return () => setHeaderAction(null);
    }, [horse.horse_id, horse.horse_name, isEditing, setHeaderAction]);

    if (isEditing) {
        return (
            <HorseDetailEditForm
                horse={horse}
                onSaved={handleSaved}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <>
            {submitStatus.message && (
                <div className={submitStatus.type === "error" ? "formAlert error" : "formAlert success"}>
                    {submitStatus.message}
                </div>
            )}

            <div className="imageContainer">
                <img
                    className="displayImage"
                    src={horse.image}
                    alt={horse.horse_name}
                />
            </div>

            <div className="formSection">
                <h3>Details</h3>
                <dl className="detailList">
                    <div className={`detailRow ${horse.breed ? "" : "empty"}`}>
                        <dt>Breed</dt>
                        <dd>{horse.breed || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${horse.sex ? "" : "empty"}`}>
                        <dt>Sex</dt>
                        <dd>{horse.sex || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${horse.birthdate ? "" : "empty"}`}>
                        <dt>Birthday</dt>
                        <dd>{horse.birthdate || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${horse.height ? "" : "empty"}`}>
                        <dt>Height</dt>
                        <dd>{horse.height ? `${horse.height} hands` : "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${horse.weight ? "" : "empty"}`}>
                        <dt>Weight</dt>
                        <dd>{horse.weight ? `${horse.weight} lbs` : "Not on file"}</dd>
                    </div>
                    <div className="detailRow">
                        <dt>Date Added</dt>
                        <dd>{FormatDate(horse.created_at)}</dd>
                    </div>
                    <div className="detailRow">
                        <dt>Date Updated</dt>
                        <dd>{FormatDate(horse.updated_at)}</dd>
                    </div>
                </dl>
            </div>

            <div className="formSection">
                <h3>Location</h3>

                {horse.barn ? (
                    <dl className="detailList">
                        <div className="detailRow">
                            <dt>Barn Name</dt>
                            <dd>{horse.barn}</dd>
                        </div>
                        <div className="detailRow">
                            <dt>Stall ID</dt>
                            <dd>{horse.stall_id}</dd>
                        </div>
                        <div className="detailRow">
                            <dt>Turnout Category</dt>
                            <dd>{horse.turnout_type}</dd>
                        </div>
                        {horse.pasture_name && (
                            <div className="detailRow">
                                <dt>Turnout Pasture</dt>
                                <dd>{horse.pasture_name}</dd>
                            </div>
                        )}
                    </dl>
                ) : (
                    <dl className="detailList">
                        <div className="detailRow">
                            <dt>Pasture Name</dt>
                            <dd>{horse.pasture_name}</dd>
                        </div>
                        <div className="detailRow">
                            <dt>Pasture Compatibility</dt>
                            <dd>{horse.turnout_type}</dd>
                        </div>
                    </dl>
                )}
            </div>

            <div className="formSection">
                <h3>Horse Safety Flags</h3>

                {(() => {
                    const flags = [
                        { on: horse.escape_risk, icon: "sprint", label: "Escape risk" },
                        { on: horse.may_bite, icon: "warning", label: "History of biting" },
                        { on: horse.may_kick, icon: "warning", label: "History of kicking" },
                        { on: horse.difficult_to_catch, icon: "pets", label: "Difficult to catch in the pasture" },
                        { on: horse.herd_dominant, icon: "groups", label: "Herd dominant" },
                        { on: horse.sedation_required, icon: "vaccines", label: "Requires sedation for vet / farrier" },
                        { on: horse.food_aggressive, icon: "restaurant", label: "Food aggression" },
                        { on: horse.requires_experienced_handler, icon: "shield_person", label: "Requires experienced handler" }
                    ];
                    const active = flags.filter((flag) => flag.on);

                    if (active.length === 0) {
                        return (
                            <div className="safetyChipGroup">
                                <span className="safetyChip calm">
                                    <span className="material-symbols-rounded">check_circle</span>
                                    No safety concerns on file
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div className="safetyChipGroup">
                            {active.map((flag) => (
                                <span key={flag.label} className="safetyChip warn">
                                    <span className="material-symbols-rounded">{flag.icon}</span>
                                    {flag.label}
                                </span>
                            ))}
                        </div>
                    );
                })()}
            </div>

            <div className="formSection">
                <h3>Temperament</h3>
                <p className="instructionsText">{horse.temperament || "Not provided"}</p>
            </div>

            {horse.notes && (
                <div className="formSection">
                    <h3>Notes</h3>
                    <p className="instructionsText">{horse.notes}</p>
                </div>
            )}
        </>
    );
}

export default HorseDetailTab;
