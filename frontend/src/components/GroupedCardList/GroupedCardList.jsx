import { useMemo, useState } from "react";
import Card from "../Card/Card.jsx";
import styles from "./GroupedCardList.module.css";

function GroupedCardList({
    items = [],
    groupBy,
    getKey,
    getImage,
    getImageAlt,
    getTitle,
    getDetails
}) {
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

    const groupedItems = useMemo(() => {
        return items.reduce((groups, item) => {
            const groupName = groupBy(item)?.trim() || "Other";

            if (!groups[groupName]) {
                groups[groupName] = [];
            }

            groups[groupName].push(item);
            return groups;
        }, {});
    }, [items, groupBy]);

    const [openGroups, setOpenGroups] = useState({});

    function toggleGroup(groupName) {
        setOpenGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    }

    const sortedGroups = Object.keys(groupedItems).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);

        const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
        const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

        return safeA - safeB;
    });

    return (
        <div className={styles.groupedList}>
            {sortedGroups.map((groupName) => {
                const isOpen = openGroups[groupName] ?? false;

                return (
                    <section key={groupName} className={styles.groupSection}>
                        <button
                            type="button"
                            className={styles.groupHeader}
                            onClick={() => toggleGroup(groupName)}
                        >
                            <span>{groupName} ({groupedItems[groupName].length})</span>
                            <span className={styles.groupMeta}>
                                {isOpen ? "−" : "+"}
                            </span>
                        </button>

                        {isOpen && (
                            <div className={styles.cardGrid}>
                                {groupedItems[groupName].map((item) => (
                                    <Card
                                        key={getKey(item)}
                                        image={getImage(item)}
                                        imageAlt={getImageAlt(item)}
                                        title={getTitle(item)}
                                        details={getDetails(item)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}

export default GroupedCardList;