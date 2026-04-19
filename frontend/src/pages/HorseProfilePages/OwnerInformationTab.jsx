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
                            <div className="recordsTable">
                                <div className="recordRow">
                                    <div className="recordLabel">Name</div>
                                    <div className="recordLabel">Phone Number</div>
                                    <div className="recordLabel">Email Address</div>
                                </div>
                                <div className="recordRow">
                                    <p>{owner.owner_name}</p>
                                    <p>{owner.owner_phone}</p>
                                    <p>{owner.owner_email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="formSection">
                            <h3>Address</h3>
                            <p><b>Street:</b> {owner.street_address}</p>
                            {owner.apt_no && (
                                <p><b>Apt. No:</b> {owner.apt_no}</p>
                            )}
                            <p><b>City:</b> {owner.city}</p>
                            <p><b>State:</b> {owner.state}</p>
                            <p><b>Zipcode:</b> {owner.zip}</p>
                            <p><b>Signed Waiver:</b> {owner.signed_waiver ? "Yes" : "No"}</p>
                        </div>

                        <div className="formSection">
                            <h3>Emergency Contact</h3>
                            <div className="recordsTable">
                                <div className="recordRow">
                                    <div className="recordLabel">Name</div>
                                    <div className="recordLabel">Relation</div>
                                    <div className="recordLabel">Phone Number</div>
                                </div>
                                <div className="recordRow">
                                    <p>{owner.emergency_contact_name}</p>
                                    <p>{owner.emergency_contact_relation}</p>
                                    <p>{owner.emergency_contact_phone}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OwnerInformationTab;
