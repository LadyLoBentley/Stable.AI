import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import FeedingRegimeEditForm from "./FeedingRegimeEditForm.jsx";

function FeedingRegimeTab() {
    const { horse } = useOutletContext();
    const [regime, setRegime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    async function fetchRegime() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`http://127.0.0.1:8002/api/feed/${horse.horse_id}`);

            if (response.status === 404) {
                setRegime(null);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load feeding regime");
            }

            const data = await response.json();
            setRegime(data);
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (horse?.horse_id) {
            fetchRegime();
        }
    }, [horse?.horse_id]);

    function handleSaved(updatedRegime) {
        setRegime(updatedRegime);
        setIsEditing(false);
    }

    if (loading) return <p>Loading feeding regime information...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="formInputs">
            <div className="formContainer">
                {isEditing ? (
                    <FeedingRegimeEditForm
                        horse={horse}
                        regime={regime}
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
                                {regime ? "Edit Feeding Regime" : "Add Feeding Regime"}
                            </button>
                        </div>

                        {!regime ? (
                            <div className="formSection">
                                <h3>Feeding Regime</h3>
                                <p>No feeding regime found for this horse.</p>
                            </div>
                        ) : (
                            <>
                                <div className="formSection">
                                    <h3>Forage</h3>
                                    <p><b>Feeds Hay:</b> {regime.feed_hay ? "Yes" : "No"}</p>

                                    {regime.feed_hay ? (
                                        <>
                                            <p><b>Hay Type:</b> {regime.hay_type || "Not on file"}</p>
                                            <p><b>Hay Quantity:</b> {regime.hay_amount || "Not on file"}</p>
                                            <p><b>Hay Unit:</b> {regime.hay_unit || "Not on file"}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p><b>Hay Replacement:</b> {regime.hay_replacement || "Not on file"}</p>
                                            <p><b>Replacement Quantity:</b> {regime.replacement_amount || "Not on file"}</p>
                                            <p><b>Replacement Unit:</b> {regime.replacement_unit || "Not on file"}</p>
                                        </>
                                    )}
                                </div>

                                <div className="formSection">
                                    <h3>Grain and Additives</h3>
                                    <p><b>Grain Type:</b> {regime.grain_type || "Not on file"}</p>
                                    <p><b>Grain Amount:</b> {regime.grain_amount || "Not on file"}</p>
                                    <p><b>Grain Unit:</b> {regime.grain_unit || "Not on file"}</p>
                                    <p><b>Add Food Additive:</b> {regime.add_food_additive ? "Yes" : "No"}</p>

                                    {regime.add_food_additive && (
                                        <>
                                            <p><b>Food Additive:</b> {regime.food_additive || "Not on file"}</p>
                                            <p><b>Food Additive Amount:</b> {regime.food_additive_amount || "Not on file"}</p>
                                            <p><b>Additive Unit:</b> {regime.additive_unit || "Not on file"}</p>
                                        </>
                                    )}
                                </div>

                                <div className="formSection">
                                    <h3>Feeding Requirements</h3>

                                    {regime.must_separate && (
                                        <p>• Horse must be separated during feeding</p>
                                    )}

                                    {regime.soak_feed && (
                                        <p>• Feed must be soaked before serving</p>
                                    )}

                                    {regime.hay_net && (
                                        <p>• Hay net is required</p>
                                    )}

                                    {!regime.must_separate && !regime.soak_feed && !regime.hay_net && (
                                        <p>• No special feeding requirements.</p>
                                    )}
                                </div>

                                <div className="formSection">
                                    <h3>Instructions</h3>
                                    <p className="instructionsText">
                                        {regime.feeding_instructions || "No additional feeding instructions on file."}
                                    </p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default FeedingRegimeTab;
