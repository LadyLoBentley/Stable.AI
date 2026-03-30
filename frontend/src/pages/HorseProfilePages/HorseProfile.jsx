import { useParams, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function HorseProfile() {
    const { horse_id } = useParams();
    const [horse, setHorse] = useState(null);

    useEffect(() => {
        async function fetchHorse() {
            const response = await fetch(`http://127.0.0.1:8002/api/horses/${horse_id}`);
            const data = await response.json();
            setHorse(data);
        }

        fetchHorse();
    }, [horse_id]);

    if (!horse) return <p>Loading horse...</p>;

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

                <Outlet context={{ horse }} />
            </div>
        </div>
    );
}

export default HorseProfile;