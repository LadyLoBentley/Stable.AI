import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import FormatDate from "../../utils/FormatDate";

function HorseDetailPage() {
    const {horse_id} = useParams();
    const [horse, setHorse] = useState(null);

    useEffect(() => {
        async function fetchHorse() {
            const response = await fetch(`http://127.0.0.1:8002/api/horses/${horse_id}`);
            const data = await response.json();
            setHorse(data);
        }

        fetchHorse();
    }, [horse_id]);

    if (!horse) return <p>Loading horse...</p>

    return (
        <div className="formInputs">
            <div className="formContainer">
                <h2>{horse.horse_name}</h2>
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
                    {horse.barn && (
                        <>
                            <p><b>Barn Name:</b> {horse.barn}</p>
                            <p><b>Stall ID:</b> {horse.stall_id}</p>
                            <p><b>Turnout Category:</b> {horse.turnout_type}</p>

                            {horse.pasture_name && (
                                <p><b>Turnout Pasture:</b> {horse.pasture_name}</p>
                            )}
                        </>
                    )}

                    {!horse.barn && (
                        <>
                            <p><b>Pasture Name:</b> {horse.pasture_name}</p>
                            <p><b>Pasture Compatibility:</b> {horse.turnout_type}</p>
                        </>
                    )}
                </div>

                <div className="formSection">
                    <h3>Horse Safety Flags</h3>
                    {horse.escape_risk && (
                        <p>• Horse is an escape risk</p>
                    )}

                    {horse.may_bite && (
                        <p>• Horse has history of biting</p>
                    )}

                   {horse.may_kick && (
                        <p>• Horse has history of kicking</p>
                   )}

                    {horse.difficult_to_catch && (
                        <p>• Horse is difficult to catch in the pasture</p>
                    )}

                    {horse.herd_dominant && (
                        <p>• Horse is herd dominant</p>
                    )}

                    {horse.sedation_required && (
                        <p>• Horse requires sedation for vet visits and/or farrier appointments</p>
                    )}

                    {horse.food_aggression && (
                        <p>• Horse exhibits food aggression</p>
                    )}

                    {horse.requires_experienced_handler && (
                        <p>• Horse requires an experienced handler</p>
                    )}
                </div>

                <div className="formSection">
                    <h3>Temperament</h3>
                    <p className="instructionsText">{horse.temperament}</p>
                </div>

                {horse.notes && (
                    <div className="formSection">
                        <h3>Notes</h3>
                        <p className="Additional Information">{horse.notes}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HorseDetailPage;