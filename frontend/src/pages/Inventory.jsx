import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupedCardList from "../components/GroupedCardList/GroupedCardList.jsx";

function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const categoryOrder = [
        "Hay",
        "Grain",
        "Food Additive",
        "Treats",
        "Supplements",
        "Electrolytes",
        "Medication",
        "Dewormer",
        "Barn Supplies",
        "Grooming",
        "Other"
    ];

    useEffect(() => {
        async function fetchInventory() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("http://127.0.0.1:8002/api/inventory/");

                if (!response.ok) {
                    throw new Error("Failed to fetch inventory data.");
                }

                const data = await response.json();
                console.log("Inventory data:", data);
                setInventoryItems(data);
            } catch (err) {
                console.error("Inventory fetch failed:", err);
                setError("Could not load inventory items.");
            } finally {
                setLoading(false);
            }
        }

        fetchInventory();
    }, []);

    if (loading) {
        return <p className="pageMessage">Loading inventory...</p>;
    }

    if (error) {
        return <p className="pageMessage errorMessage">{error}</p>;
    }

    return (
        <div className="inventory-page">
            <GroupedCardList
                title="Inventory"
                subtitle="Open an item to adjust quantity, replace images, and keep barn stock instructions up to date."
                actionLabel="Add Inventory Item"
                actionTo="/add-item"
                categoryOrder={categoryOrder}
                items={inventoryItems}
                emptyMessage="No items in inventory yet. Add your first item to get started."
                groupBy={(item) => item.category || "Other"}
                getKey={(item) => item.item_id}
                getImage={(item) => item.image_url || ""}
                getImageAlt={(item) => item.label || "Inventory item"}
                getTitle={(item) => item.label}
                getDetails={(item) => [
                    { label: "Quantity", value: `${item.quantity ?? 0} ${item.unit || ""}`.trim() },
                    { label: "Grade", value: item.grade || "Not Applicable" },
                    { label: "Stock Status", value: item.stock_status || "Unknown" },
                ]}
                onCardClick={(item) => navigate(`/inventory/${item.item_id}`)}
            />
        </div>
    );
}

export default Inventory;
