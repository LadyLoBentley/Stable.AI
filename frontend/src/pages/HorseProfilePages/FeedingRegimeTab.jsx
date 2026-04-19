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
                                <div className="emptyState">No feeding regime found for this horse.</div>
                            </div>
                        ) : (
                            <>
                                <div className="formSection">
                                    <h3>Forage</h3>
                                    <dl className="detailList">
                                        <div className="detailRow">
                                            <dt>Feeds Hay</dt>
                                            <dd>
                                                <span className={`detailBadge ${regime.feed_hay ? "" : "no"}`}>
                                                    {regime.feed_hay ? "Yes" : "No"}
                                                </span>
                                            </dd>
                                        </div>

                                        {regime.feed_hay ? (
                                            <>
                                                <div className={`detailRow ${regime.hay_type ? "" : "empty"}`}>
                                                    <dt>Hay Type</dt>
                                                    <dd>{regime.hay_type || "Not on file"}</dd>
                                                </div>
                                                <div className={`detailRow ${regime.hay_amount ? "" : "empty"}`}>
                                                    <dt>Hay Quantity</dt>
                                                    <dd>{regime.hay_amount || "Not on file"}</dd>
                                                </div>
                                                <div className={`detailRow ${regime.hay_unit ? "" : "empty"}`}>
                                                    <dt>Hay Unit</dt>
                                                    <dd>{regime.hay_unit || "Not on file"}</dd>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={`detailRow ${regime.hay_replacement ? "" : "empty"}`}>
                                                    <dt>Hay Replacement</dt>
                                                    <dd>{regime.hay_replacement || "Not on file"}</dd>
                                                </div>
                                                <div className={`detailRow ${regime.replacement_amount ? "" : "empty"}`}>
                                                    <dt>Replacement Quantity</dt>
                                                    <dd>{regime.replacement_amount || "Not on file"}</dd>
                                                </div>
                                                <div className={`detailRow ${regime.replacement_unit ? "" : "empty"}`}>
                                                    <dt>Replacement Unit</dt>
                                                    <dd>{regime.replacement_unit || "Not on file"}</dd>
                                                </div>
                                            </>
                                        )}
                                    </dl>
                                </div>

                                <div className="formSection">
                                    <h3>Grain and Additives</h3>
                                    <dl className="detailList">
                                        <div className={`detailRow ${regime.grain_type ? "" : "empty"}`}>
                                            <dt>Grain Type</dt>
                                            <dd>{regime.grain_type || "Not on file"}</dd>
                                        </div>
                                        <div className={`detailRow ${regime.grain_amount ? "" : "empty"}`}>
                                            <dt>Grain Amount</dt>
                                            <dd>{regime.grain_amount || "Not on file"}</dd>
                                        </div>
                                        <div className={`detailRow ${regime.grain_unit ? "" : "empty"}`}>
                                            <dt>Grain Unit</dt>
                                            <dd>{regime.grain_unit || "Not on file"}</dd>
                                        </div>
                                        <div className="detailRow">
                                            <dt>Food Additive</dt>
                                            <dd>
                                                <span className={`detailBadge ${regime.add_food_additive ? "" : "no"}`}>
                                                    {regime.add_food_additive ? "Yes" : "No"}
                                                </span>
                                            </dd>
                                        </div>

                                        {regime.add_food_additive && (
                                            <>
                                                <div className={`detailRow ${regime.food_additive ? "" : "empty"}`}>
                                                    <dt>Additive</dt>
                                                    <dd>{regime.food_additive || "Not on file"}</dd>
                                                </div>
                                                <div className={`detailRow ${regime.food_additive_amount ? "" : "empty"}`}>
                                                    <dt>Additive Amount</dt>
                                                    <dd>{regime.food_additive_amount || "Not on file"}</dd>
                                                </div>
                                                <div className={`detailRow ${regime.additive_unit ? "" : "empty"}`}>
                                                    <dt>Additive Unit</dt>
                                                    <dd>{regime.additive_unit || "Not on file"}</dd>
                                                </div>
                                            </>
                                        )}
                                    </dl>
                                </div>

                                <div className="formSection">
                                    <h3>Feeding Requirements</h3>

                                    {(() => {
                                        const reqs = [
                                            { on: regime.must_separate, icon: "fence", label: "Must be separated during feeding" },
                                            { on: regime.soak_feed, icon: "water_drop", label: "Feed must be soaked before serving" },
                                            { on: regime.hay_net, icon: "grid_view", label: "Hay net required" }
                                        ];
                                        const active = reqs.filter((r) => r.on);

                                        if (active.length === 0) {
                                            return (
                                                <div className="safetyChipGroup">
                                                    <span className="safetyChip calm">
                                                        <span className="material-symbols-rounded">check_circle</span>
                                                        No special feeding requirements
                                                    </span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="safetyChipGroup">
                                                {active.map((req) => (
                                                    <span key={req.label} className="safetyChip">
                                                        <span className="material-symbols-rounded">{req.icon}</span>
                                                        {req.label}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    })()}
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
