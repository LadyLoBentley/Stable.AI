import { useMemo, useState } from "react";
import Card from "../Card/Card.jsx";
import styles from "./GroupedCardList.module.css";

function GroupedCardList({
    title,
    categoryOrder = [],
    items = [],
    groupBy,
    getKey,
    getImage,
    getPdfUrl,
    getImageAlt,
    getTitle,
    getDetails,
    onCardClick
}) {
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

    const [openGroups, setOpenGroups] = useState(() => {
        if (categoryOrder.length > 0) {
            return { [categoryOrder[0]]: true };
        }
        return {};
    });

    function toggleGroup(groupName) {
        setOpenGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    }

    const sortedGroups = Object.keys(groupedItems).sort((a, b) => {
        if (!categoryOrder.length) {
            return a.localeCompare(b);
        }

        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);

        const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
        const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

        if (safeA !== safeB) {
            return safeA - safeB;
        }

        return a.localeCompare(b);
    });

    return (
        <div className={styles.groupedList}>
            <div className={styles.contentWrap}>
                <div className="listingPageHeader">
                    <h2 className="mainTitle">{title}</h2>
                </div>

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
                                            image={getImage?.(item)}
                                            pdfUrl={getPdfUrl?.(item)}
                                            imageAlt={getImageAlt(item)}
                                            title={getTitle(item)}
                                            details={getDetails(item)}
                                            onClick={() => onCardClick?.(item)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}

export default GroupedCardList;