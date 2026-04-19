import { useParams, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function HorseProfile() {
    const { horse_id } = useParams();
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function refreshHorse() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`http://127.0.0.1:8002/api/horses/${horse_id}`);

            if (!response.ok) {
                throw new Error("Failed to load horse profile.");
            }

            const data = await response.json();
            setHorse(data);
        } catch (fetchError) {
            setError(fetchError.message || "Failed to load horse profile.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshHorse();
    }, [horse_id]);

    if (loading) return <p>Loading horse...</p>;
    if (error) return <p>{error}</p>;
    if (!horse) return <p>Horse not found.</p>;

    return (
        <div className="formInputs">
            <div className="formContainer">
                <h2>{horse.horse_name}</h2>
                <div className="horseTabRow">
                    <NavLink
                        to={`/horses/${horse_id}`}
                        end
                        className={({ isActive }) =>
                            isActive ? "horseTab activeTab" : "horseTab"
                        }
                    >
                        Details
                    </NavLink>

                    <NavLink
                        to={`/horses/${horse_id}/medical`}
                        className={({ isActive }) =>
                            isActive ? "horseTab activeTab" : "horseTab"
                        }
                    >
                        Medical Records
                    </NavLink>

                    <NavLink
                        to={`/horses/${horse_id}/meds-supplements`}
                        className={({ isActive }) =>
                            isActive ? "horseTab activeTab" : "horseTab"
                        }
                    >
                        Medications & Supplements
                    </NavLink>

                    <NavLink
                        to={`/horses/${horse_id}/feed`}
                        className={({ isActive }) =>
                            isActive ? "horseTab activeTab" : "horseTab"
                        }
                    >
                        Feeding Regime
                    </NavLink>

                    <NavLink
                        to={`/horses/${horse_id}/owner`}
                        className={({ isActive }) =>
                            isActive ? "horseTab activeTab" : "horseTab"
                        }
                    >
                        Owner Information
                    </NavLink>
                </div>

                <Outlet context={{ horse, setHorse, refreshHorse }} />
            </div>
        </div>
    );
}

export default HorseProfile;
