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
                            <p><b>Breed:</b> {horse.breed}</p>
                            <p><b>Sex:</b> {horse.sex}</p>
                            <p><b>Birthday:</b> {horse.birthdate}</p>
                            <p><b>Height:</b> {horse.height} hands</p>
                            <p><b>Weight:</b> {horse.weight} lbs</p>
                            <p><b>Date Added:</b> {FormatDate(horse.created_at)}</p>
                            <p><b>Date Updated:</b> {FormatDate(horse.updated_at)}</p>
                        </div>

                        <div className="formSection">
                            <h3>Location</h3>

                            {horse.barn ? (
                                <>
                                    <p><b>Barn Name:</b> {horse.barn}</p>
                                    <p><b>Stall ID:</b> {horse.stall_id}</p>
                                    <p><b>Turnout Category:</b> {horse.turnout_type}</p>
                                    {horse.pasture_name && (
                                        <p><b>Turnout Pasture:</b> {horse.pasture_name}</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p><b>Pasture Name:</b> {horse.pasture_name}</p>
                                    <p><b>Pasture Compatibility:</b> {horse.turnout_type}</p>
                                </>
                            )}
                        </div>

                        <div className="formSection">
                            <h3>Horse Safety Flags</h3>

                            {horse.escape_risk && <p>• Horse is an escape risk</p>}
                            {horse.may_bite && <p>• Horse has history of biting</p>}
                            {horse.may_kick && <p>• Horse has history of kicking</p>}
                            {horse.difficult_to_catch && (
                                <p>• Horse is difficult to catch in the pasture</p>
                            )}
                            {horse.herd_dominant && <p>• Horse is herd dominant</p>}
                            {horse.sedation_required && (
                                <p>• Horse requires sedation for vet visits and/or farrier appointments</p>
                            )}
                            {horse.food_aggressive && (
                                <p>• Horse exhibits food aggression</p>
                            )}
                            {horse.requires_experienced_handler && (
                                <p>• Horse requires an experienced handler</p>
                            )}

                            {!horse.escape_risk &&
                                !horse.may_bite &&
                                !horse.may_kick &&
                                !horse.difficult_to_catch &&
                                !horse.herd_dominant &&
                                !horse.sedation_required &&
                                !horse.food_aggressive &&
                                !horse.requires_experienced_handler && (
                                    <p>• Horse has no safety concerns.</p>
                                )}
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
