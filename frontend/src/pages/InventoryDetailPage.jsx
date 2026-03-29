import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import FormatDate from "../utils/FormatDate";

function InventoryDetailPage() {
    const { item_id } = useParams();
    const[item, setItem] = useState(null);

    useEffect(() => {
        async function fetchItem() {
            const response = await fetch(`http://127.0.0.1:8002/api/inventory/${item_id}`);
            const data = await response.json();
            setItem(data);
        }
        fetchItem();
    }, [item_id]);

    if (!item) return <p>Loading item...</p>;

    return (
        <div className="formInputs">
            <div className="formContainer">
                <h2>{item.label}</h2>
                <div className="imageContainer">
                    <img
                        className="displayImage"
                        src={item.image_url}
                        alt={item.label}
                    />
                </div>

                <div className="formSection">
                    <h3>Details</h3>
                    <p><b>Quantity:</b> {item.quantity} {item.unit}</p>
                    <p><b>Category:</b> {item.category}</p>
                    <p><b>Grade:</b> {item.grade}</p>
                    <p><b>Date Added:</b> {FormatDate(item.created_at)}</p>
                    <p><b>Last Updated:</b> {FormatDate(item.updated_at)}</p>
                </div>

                <div className="formSection">
                    <h3>Instructions</h3>
                    <p className="instructionsText">{item.instructions}</p>
                </div>
            </div>
        </div>
    )
}

export default InventoryDetailPage;