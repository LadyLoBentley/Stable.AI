import { useEffect, useState } from "react";
import GroupedCardList from "../components/GroupedCardList/GroupedCardList.jsx";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const categoryOrder = [
        "Barn Information",
        "Blank Templates",
        "Boarding Agreements",
        "Care Instructions",
        "Competition Records",
        "Invoice & Billing",
        "Lesson Agreements",
        "Liability Waivers",
        "Medical Records",
        "Policy & Rules",
        "Training Programs",
        "Other"
    ];

    useEffect(() => {
        async function fetchDocuments() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("http://127.0.0.1:8002/api/documents/");

                if (!response.ok) {
                    throw new Error("Failed to fetch documents.");
                }

                const data = await response.json();
                console.log("document data:", data);
                setDocuments(data);
            } catch (err) {
                console.error("document fetch failed:", err);
                setError("Could not load documents.");
            } finally {
                setLoading(false);
            }
        }

        fetchDocuments();
    }, []);

    if (loading) {
        return <p className="pageMessage">Loading documents...</p>;
    }

    if (error) {
        return <p className="pageMessage errorMessage">{error}</p>;
    }

    if (documents.length === 0) {
        return <p className="pageMessage">No documents found.</p>;
    }

    return (
        <div className="inventory-page">
            <GroupedCardList
                title="Documents"
                categoryOrder={categoryOrder}
                items={documents}
                groupBy={(document) => document.category || "Other"}
                getKey={(document) => document.document_id}
                getImage={(document) =>
                    document.file_type?.startsWith("image/") ? document.file_url : ""
                }
                getImageAlt={(document) => document.document_name || "document"}
                getTitle={(document) => document.document_name}
                getDetails={(document) => [
                    { label: "Category", value: document.category },
                    { label: "Uploaded", value: document.created_at},
                    { label: "Updated", value: document.updated_at}
                ]}
            />
        </div>
    );
}

export default Documents;