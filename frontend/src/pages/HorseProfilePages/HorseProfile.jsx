import { useParams, NavLink, Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function HorseProfile() {
    const { horse_id } = useParams();
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [headerAction, setHeaderAction] = useState(null);

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

    if (loading) return <p className="pageMessage">Loading horse...</p>;
    if (error) return <p className="pageMessage errorMessage">{error}</p>;
    if (!horse) return <p className="pageMessage">Horse not found.</p>;

    const headerActions = headerAction
        ? (Array.isArray(headerAction) ? headerAction : [headerAction])
        : [];

    return (
        <div className="formInputs">
            <div className="formContainer">
                <div className="horseProfileHeader">
                    <h2 className="mainTitle">{horse.horse_name}</h2>
                    {headerActions.length > 0 && (
                        <div className="horseProfileHeaderActions">
                            {headerActions.map((action) => {
                                const actionClassName = [
                                    "profileActionButton",
                                    "horseHeaderAction",
                                    action.variant || ""
                                ].filter(Boolean).join(" ");

                                if (action.to) {
                                    return (
                                        <Link
                                            key={action.key || action.label}
                                            to={action.to}
                                            className={actionClassName}
                                        >
                                            {action.label}
                                        </Link>
                                    );
                                }

                                return (
                                    <button
                                        key={action.key || action.label}
                                        type="button"
                                        className={actionClassName}
                                        onClick={action.onClick}
                                    >
                                        {action.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
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

                <div className="horseProfileContent">
                    <Outlet context={{ horse, setHorse, refreshHorse, setHeaderAction }} />
                </div>
            </div>
        </div>
    );
}

export default HorseProfile;
