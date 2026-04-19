import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import FormatDate from "../../utils/FormatDate.jsx";

function formatDateTime(value) {
    if (!value) {
        return "Not recorded";
    }

    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function renderDate(value) {
    return value ? FormatDate(value) : "Not recorded";
}

function SnapshotSection({ title, children }) {
    return (
        <>
            <h4 className="subSectionHeader">{title}</h4>
            {children}
        </>
    );
}

function MedicalSnapshotCard({ record, isCurrent }) {
    return (
        <div className="formSection">
            <div className="historySnapshotHeader">
                <div>
                    <h3>{isCurrent ? "Current Medical Snapshot" : "Historical Medical Snapshot"}</h3>
                    <p className="historySnapshotMeta">
                        Saved {formatDateTime(record.created_at)}
                        {record.updated_at !== record.created_at && ` • Updated ${formatDateTime(record.updated_at)}`}
                    </p>
                </div>

                <div className="safetyChipGroup">
                    <span className={`safetyChip ${isCurrent ? "calm" : ""}`}>
                        <span className="material-symbols-rounded">
                            {isCurrent ? "history_toggle_off" : "history"}
                        </span>
                        {isCurrent ? "Current record" : "Archived snapshot"}
                    </span>
                </div>
            </div>

            <SnapshotSection title="Veterinary Contacts">
                <dl className="detailList">
                    <div className={`detailRow ${record.vet_clinic ? "" : "empty"}`}>
                        <dt>Vet Clinic</dt>
                        <dd>{record.vet_clinic || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.vet_name ? "" : "empty"}`}>
                        <dt>Veterinarian</dt>
                        <dd>{record.vet_name || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.vet_phone ? "" : "empty"}`}>
                        <dt>Vet Phone</dt>
                        <dd>{record.vet_phone || "Not on file"}</dd>
                    </div>
                    <div className="detailRow">
                        <dt>Emergency Authorization</dt>
                        <dd>
                            <span className={`detailBadge ${record.emergency_authorization ? "" : "warn"}`}>
                                {record.emergency_authorization ? "Authorized" : "Not Authorized"}
                            </span>
                        </dd>
                    </div>
                    <div className={`detailRow ${record.emergency_clinic ? "" : "empty"}`}>
                        <dt>Emergency Clinic</dt>
                        <dd>{record.emergency_clinic || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.emergency_vet_name ? "" : "empty"}`}>
                        <dt>Emergency Vet</dt>
                        <dd>{record.emergency_vet_name || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.emergency_vet_phone ? "" : "empty"}`}>
                        <dt>Emergency Phone</dt>
                        <dd>{record.emergency_vet_phone || "Not on file"}</dd>
                    </div>
                </dl>
            </SnapshotSection>

            <SnapshotSection title="Vaccination Dates">
                <dl className="detailList">
                    <div className={`detailRow ${record.rabies_expiration ? "" : "empty"}`}>
                        <dt>Rabies</dt>
                        <dd>{renderDate(record.rabies_expiration)}</dd>
                    </div>
                    <div className={`detailRow ${record.tetanus_expiration ? "" : "empty"}`}>
                        <dt>Tetanus</dt>
                        <dd>{renderDate(record.tetanus_expiration)}</dd>
                    </div>
                    <div className={`detailRow ${record.west_nile_expiration ? "" : "empty"}`}>
                        <dt>West Nile</dt>
                        <dd>{renderDate(record.west_nile_expiration)}</dd>
                    </div>
                    <div className={`detailRow ${record.eee_wee_expiration ? "" : "empty"}`}>
                        <dt>EEE / WEE</dt>
                        <dd>{renderDate(record.eee_wee_expiration)}</dd>
                    </div>
                    <div className={`detailRow ${record.flu_rhino_expiration ? "" : "empty"}`}>
                        <dt>Flu / Rhino</dt>
                        <dd>{renderDate(record.flu_rhino_expiration)}</dd>
                    </div>
                    <div className={`detailRow ${record.coggins_expiration ? "" : "empty"}`}>
                        <dt>Coggins</dt>
                        <dd>{renderDate(record.coggins_expiration)}</dd>
                    </div>
                </dl>
            </SnapshotSection>

            <SnapshotSection title="Preventative Care">
                <dl className="detailList">
                    <div className="detailRow">
                        <dt>Shoeing Status</dt>
                        <dd>
                            <span className={`detailBadge ${record.has_shoes ? "" : "no"}`}>
                                {record.has_shoes ? "Shod" : "Barefoot"}
                            </span>
                        </dd>
                    </div>
                    <div className={`detailRow ${record.farrier_name ? "" : "empty"}`}>
                        <dt>Farrier</dt>
                        <dd>{record.farrier_name || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.farrier_date ? "" : "empty"}`}>
                        <dt>Farrier Visit</dt>
                        <dd>{renderDate(record.farrier_date)}</dd>
                    </div>
                    <div className={`detailRow ${record.dentist_name ? "" : "empty"}`}>
                        <dt>Dentist</dt>
                        <dd>{record.dentist_name || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.dental_date ? "" : "empty"}`}>
                        <dt>Dental Visit</dt>
                        <dd>{renderDate(record.dental_date)}</dd>
                    </div>
                    <div className={`detailRow ${record.chiropractor_name ? "" : "empty"}`}>
                        <dt>Chiropractor</dt>
                        <dd>{record.chiropractor_name || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.chiropractor_date ? "" : "empty"}`}>
                        <dt>Chiropractic Visit</dt>
                        <dd>{renderDate(record.chiropractor_date)}</dd>
                    </div>
                    <div className={`detailRow ${record.massage_therapist ? "" : "empty"}`}>
                        <dt>Massage Therapist</dt>
                        <dd>{record.massage_therapist || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.massage_date ? "" : "empty"}`}>
                        <dt>Massage Visit</dt>
                        <dd>{renderDate(record.massage_date)}</dd>
                    </div>
                    <div className={`detailRow ${record.deworm_provider ? "" : "empty"}`}>
                        <dt>Deworm Provider</dt>
                        <dd>{record.deworm_provider || "Not on file"}</dd>
                    </div>
                    <div className={`detailRow ${record.deworm_date ? "" : "empty"}`}>
                        <dt>Deworm Date</dt>
                        <dd>{renderDate(record.deworm_date)}</dd>
                    </div>
                </dl>
            </SnapshotSection>

            {record.emergency_instructions && (
                <SnapshotSection title="Emergency Instructions">
                    <p className="instructionsText">{record.emergency_instructions}</p>
                </SnapshotSection>
            )}

            {record.medical_notes && (
                <SnapshotSection title="Medical Notes">
                    <p className="instructionsText">{record.medical_notes}</p>
                </SnapshotSection>
            )}
        </div>
    );
}

function MedicalRecordHistoryPage() {
    const { horse, setHeaderAction } = useOutletContext();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setHeaderAction({
            key: "current-medical-record",
            label: "Current Medical Record",
            to: `/horses/${horse.horse_id}/medical`,
            variant: "secondary"
        });

        return () => setHeaderAction(null);
    }, [horse.horse_id, setHeaderAction]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://127.0.0.1:8002/api/medical_records/horses/${horse.horse_id}/history`
                );

                if (!response.ok) {
                    throw new Error("Failed to load medical record history.");
                }

                const data = await response.json();
                const list = Array.isArray(data) ? data : [];
                setHistory(list);
                setSelectedIndex(0);
            } catch (fetchError) {
                setError(fetchError.message || "Failed to load medical record history.");
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [horse.horse_id]);

    if (loading) return <p className="pageMessage">Loading medical history...</p>;
    if (error) return <p className="pageMessage errorMessage">{error}</p>;

    const safeIndex = Math.min(selectedIndex, Math.max(history.length - 1, 0));
    const selectedRecord = history[safeIndex];

    return (
        <>
            <div className="formNote">
                Medical history shows saved snapshots newest first. Pick any date below to view that snapshot — the current record is selected by default.
            </div>

            {history.length === 0 && (
                <div className="formSection">
                    <h3>Medical History</h3>
                    <div className="emptyState">No medical record history is available for this horse yet.</div>
                </div>
            )}

            {history.length > 0 && (
                <>
                    <div
                        className="medicalTimeline"
                        role="tablist"
                        aria-label="Medical record history"
                    >
                        {history.map((record, index) => {
                            const isSelected = safeIndex === index;
                            const isCurrent = index === 0;
                            return (
                                <button
                                    key={record.medical_record_id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isSelected}
                                    className={`medicalTimelineChip ${isSelected ? "selected" : ""} ${isCurrent ? "current" : ""}`}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <span className="material-symbols-rounded medicalTimelineChipIcon" aria-hidden="true">
                                        {isCurrent ? "event_available" : "calendar_month"}
                                    </span>
                                    <span className="medicalTimelineChipDate">
                                        {renderDate(record.created_at)}
                                    </span>
                                    {isCurrent && (
                                        <span className="medicalTimelineChipTag">Current</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {history.length === 1 && (
                        <div className="formNote">
                            No older medical snapshots are on file yet. Future updates will appear here automatically.
                        </div>
                    )}

                    {selectedRecord && (
                        <MedicalSnapshotCard
                            key={selectedRecord.medical_record_id}
                            record={selectedRecord}
                            isCurrent={safeIndex === 0}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default MedicalRecordHistoryPage;
