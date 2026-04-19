import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import OwnerEditForm from "./OwnerEditForm.jsx";

function OwnerInformationTab() {
    const { horse, refreshHorse, setHeaderAction } = useOutletContext();
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

    useEffect(() => {
        if (loading || error || !owner || isEditing) {
            setHeaderAction(null);
            return;
        }

        setHeaderAction({
            label: "Edit Owner Information",
            onClick: () => setIsEditing(true)
        });

        return () => setHeaderAction(null);
    }, [error, isEditing, loading, owner, setHeaderAction]);

    async function handleSaved(updatedOwner) {
        setOwner(updatedOwner);
        setIsEditing(false);
        await refreshHorse();
    }

    if (loading) return <p className="pageMessage">Loading owner information...</p>;
    if (error) return <p className="pageMessage errorMessage">{error}</p>;
    if (!owner) return <p className="pageMessage">No Owner Found.</p>;

    if (isEditing) {
        return (
            <OwnerEditForm
                owner={owner}
                onSaved={handleSaved}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <>
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
                </dl>
            </div>

            <div className="formSection">
                <h3>Liability Waiver</h3>
                <div className={`waiverCard ${owner.signed_waiver ? "signed" : "pending"}`}>
                    <div className="waiverCardIcon" aria-hidden="true">
                        <span className="material-symbols-rounded">
                            {owner.signed_waiver ? "verified_user" : "gpp_bad"}
                        </span>
                    </div>
                    <div className="waiverCardBody">
                        <div className="waiverCardHeader">
                            <span className="waiverCardTitle">
                                {owner.signed_waiver ? "Signed waiver on file" : "Waiver not signed"}
                            </span>
                            <span className="waiverCardBadge">
                                {owner.signed_waiver ? "Active" : "Action required"}
                            </span>
                        </div>
                        <p className="waiverCardDescription">
                            {owner.signed_waiver
                                ? "Owner has signed a liability waiver acknowledging the inherent risks of horse boarding, handling, riding, and related equine activities, and releasing the barn, its owners, staff, trainers, agents, and affiliates from liability to the fullest extent permitted by law."
                                : "No signed liability waiver is on file. Owner participation should remain pending until a waiver is signed acknowledging the inherent risks of equine activities and releasing the barn, its owners, staff, trainers, agents, and affiliates from liability to the fullest extent permitted by law."}
                        </p>
                    </div>
                </div>
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
    );
}

export default OwnerInformationTab;
