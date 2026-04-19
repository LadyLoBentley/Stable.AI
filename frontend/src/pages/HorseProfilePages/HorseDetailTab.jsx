import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import FormatDate from "../../utils/FormatDate";
import HorseDetailEditForm from "./HorseDetailEditForm.jsx";

function HorseDetailTab() {
    const { horse, setHorse } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);

    function handleSaved(updatedHorse) {
        setHorse(updatedHorse);
        setIsEditing(false);
    }

    return (
        <div className="formInputs">
            <div className="formContainer">
                {isEditing ? (
                    <HorseDetailEditForm
                        horse={horse}
                        onSaved={handleSaved}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <div className="profileSectionActions">
                            <button
                                type="button"
                                className="profileActionButton"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Horse Details
                            </button>
                        </div>

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
                                const active = flags.filter((f) => f.on);

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
                )}
            </div>
        </div>
    );
}

export default HorseDetailTab;
