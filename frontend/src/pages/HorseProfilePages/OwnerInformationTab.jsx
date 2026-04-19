import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import OwnerEditForm from "./OwnerEditForm.jsx";

function OwnerInformationTab() {
    const { horse, refreshHorse } = useOutletContext();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    async function fetchOwner() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`http://127.0.0.1:8002/api/owner/${horse.owner_id}`);

            if (!response.ok) {
                throw new Error("Failed to load owner");
            }

            const data = await response.json();
            setOwner(data);
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOwner();
    }, [horse.owner_id]);

    async function handleSaved(updatedOwner) {
        setOwner(updatedOwner);
        setIsEditing(false);
        await refreshHorse();
    }

    if (loading) return <p>Loading owner information...</p>;
    if (error) return <p>{error}</p>;
    if (!owner) return <p>No Owner Found.</p>;

    return (
        <div className="formInputs">
            <div className="formContainer">
                {isEditing ? (
                    <OwnerEditForm
                        owner={owner}
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
                                Edit Owner Information
                            </button>
                        </div>

                        <div className="formSection">
                            <h3>Owner Information</h3>
                            <dl className="detailList">
                                <div className="detailRow">
                                    <dt>Name</dt>
                                    <dd>{owner.owner_name}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Phone Number</dt>
                                    <dd>{owner.owner_phone}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Email Address</dt>
                                    <dd>{owner.owner_email}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="formSection">
                            <h3>Address</h3>
                            <dl className="detailList">
                                <div className={`detailRow wide ${owner.street_address ? "" : "empty"}`}>
                                    <dt>Street</dt>
                                    <dd>{owner.street_address || "Not on file"}</dd>
                                </div>
                                {owner.apt_no && (
                                    <div className="detailRow">
                                        <dt>Apt. No.</dt>
                                        <dd>{owner.apt_no}</dd>
                                    </div>
                                )}
                                <div className={`detailRow ${owner.city ? "" : "empty"}`}>
                                    <dt>City</dt>
                                    <dd>{owner.city || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${owner.state ? "" : "empty"}`}>
                                    <dt>State</dt>
                                    <dd>{owner.state || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${owner.zip ? "" : "empty"}`}>
                                    <dt>Zipcode</dt>
                                    <dd>{owner.zip || "Not on file"}</dd>
                                </div>
                                <div className="detailRow">
                                    <dt>Signed Waiver</dt>
                                    <dd>
                                        <span className={`detailBadge ${owner.signed_waiver ? "" : "warn"}`}>
                                            {owner.signed_waiver ? "Yes" : "Not signed"}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="formSection">
                            <h3>Emergency Contact</h3>
                            <dl className="detailList">
                                <div className={`detailRow ${owner.emergency_contact_name ? "" : "empty"}`}>
                                    <dt>Name</dt>
                                    <dd>{owner.emergency_contact_name || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${owner.emergency_contact_relation ? "" : "empty"}`}>
                                    <dt>Relation</dt>
                                    <dd>{owner.emergency_contact_relation || "Not on file"}</dd>
                                </div>
                                <div className={`detailRow ${owner.emergency_contact_phone ? "" : "empty"}`}>
                                    <dt>Phone Number</dt>
                                    <dd>{owner.emergency_contact_phone || "Not on file"}</dd>
                                </div>
                            </dl>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OwnerInformationTab;
