import GroupedCardList from "../components/GroupedCardList/GroupedCardList.jsx";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

function HorseDashboard() {
    const barnOrder = [
        "Main Barn",
        "Small Barn",
    ];

    const [horses, setHorses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHorses() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("http://127.0.0.1:8002/api/horses/");

                if (!response.ok) {
                    throw new Error("Failed to fetch horses.");
                }

                const data = await response.json();
                console.log("horses:", data);
                setHorses(data);

            } catch (e) {
                setError(String(e) + " Could not load horses.");
            } finally {
                setLoading(false);
            }
        }

        void fetchHorses();
    }, []);

    if (loading) {
        return <p className="pageMessage">Loading horses...</p>;
    }

    if (error) {
        return <p className="pageMessage errorMessage">{error}</p>;
    }

    return (
        <GroupedCardList
            title="Horse Dashboard"
            subtitle="Select a horse card to open the full profile with health, feeding, medication, and owner details."
            countLabel={horses.length === 1 ? "horse" : "horses"}
            actionLabel="Add Horse"
            actionTo="/add-horse"
            searchPlaceholder="Search by horse name, breed, barn, pasture, or stall"
            categoryOrder={barnOrder}
            items={horses}
            emptyMessage="No horses yet. Add your first horse to begin building profiles."
            groupBy={(horse) => horse.barn || horse.pasture_name || "Other"}
            getKey={(horse) => horse.horse_id}
            getImage={(horse) => horse.image}
            getImageAlt={(horse) => horse.horse_name}
            getTitle={(horse) => horse.horse_name}
            getDetails={(horse) => [
                { label: "Sex", value: horse.sex },
                { label: "Breed", value: horse.breed },
                    ...(horse.stall_id ? [{ label: "Stall", value: horse.stall_id }] : [])
                ]}
            onCardClick={(item) => navigate(`/horses/${item.horse_id}`)}
        />
    );
}

export default HorseDashboard;
