import { useOutletContext } from "react-router-dom";
import FormatDate from "../../utils/FormatDate";
import {useEffect, useState} from "react";

function OwnerInformationTab() {
    const { horse } = useOutletContext();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOwner();
    }, [horse.owner_id]);

    if (loading) return <p>Loading owner information...</p>;
    if (error) return <p>{error}</p>;
    if (!owner) return <p>No Owner Found.</p>;

    return (
        <div className="formInputs">
            <div className="formContainer">

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
                    <p><b>City:</b> {owner.city} lbs</p>
                    <p><b>State:</b> {owner.state}</p>
                    <p><b>Zipcode:</b> {owner.zip}</p>
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
            </div>
        </div>
    )
}

export default OwnerInformationTab;