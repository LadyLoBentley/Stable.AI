import { useEffect, useState } from "react";
import Card from "../components/Card/Card.jsx";

function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (inventoryItems.length === 0) {
        return <p className="pageMessage">No items found.</p>;
    }


    return (
        <>
        <h2 className="mainTitle">Inventory</h2>

        <div className="cardContainer">
            {inventoryItems.map((item) => (
                <Card
                    key={item.item_id}
                    image={item.image_url}
                    imageAlt={item.label}
                    title={item.label}
                    details={[
                        { label: "Quantity", value: `${item.quantity} ${item.unit}` },
                        { label: "Category", value: item.category },
                        { label: "Grade", value: item.grade },
                        { label: "Stock Status", value: item.stock_status }
                    ]}
                    onClick={() => console.log(`Open inventory item ${item.item_id}`)}
                />
            ))}
        </div>
        </>
    );
}

export default Inventory;