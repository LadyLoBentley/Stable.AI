import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GroupedCardList from "../components/GroupedCardList/GroupedCardList.jsx";
import FormatDate from "../utils/FormatDate.jsx";
import { DOCUMENT_CATEGORIES } from "./documentUtils.js";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
                setDocuments(Array.isArray(data) ? data : []);
            } catch (fetchError) {
                setError(fetchError.message || "Could not load documents.");
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

    if (!documents.length) {
        return (
            <GroupedCardList
                title="Documents"
                subtitle="Upload contracts, veterinary records, insurance papers, and other important files to keep them organized by category."
                actionLabel="Upload Document"
                actionTo="/add-document"
                items={[]}
                emptyMessage="No documents yet. Upload your first file to get started."
                groupBy={() => ""}
                getKey={() => ""}
                getTitle={() => ""}
                getDetails={() => []}
            />
        );
    }

    return (
        <div className="inventory-page">
            <GroupedCardList
                title="Documents"
                subtitle="Open any card to view file details, edit metadata, replace uploads, or remove the document."
                actionLabel="Upload Document"
                actionTo="/add-document"
                categoryOrder={DOCUMENT_CATEGORIES}
                items={documents}
                groupBy={(document) => document.category || "Other"}
                getKey={(document) => document.document_id}
                getImage={(document) =>
                    document.file_url?.match(/\.(jpg|jpeg|png|webp)$/i)
                        ? document.file_url
                        : ""
                }
                getPdfUrl={(document) =>
                    document.file_url?.match(/\.pdf$/i)
                        ? document.file_url
                        : ""
                }
                getImageAlt={(document) => document.document_name || "document"}
                getTitle={(document) => document.document_name}
                getDetails={(document) => [
                    { label: "Description", value: document.notes || "Other" },
                    { label: "Uploaded", value: FormatDate(document.created_at) },
                    { label: "Updated", value: FormatDate(document.updated_at) }
                ]}
                onCardClick={(document) => navigate(`/documents/${document.document_id}`)}
            />
        </div>
    );
}

export default Documents;
