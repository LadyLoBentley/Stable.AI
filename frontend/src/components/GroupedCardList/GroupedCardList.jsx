import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../Card/Card.jsx";
import styles from "./GroupedCardList.module.css";

function GroupedCardList({
    title,
    subtitle = "",
    countLabel = "",
    actionLabel = "",
    actionTo = "",
    searchPlaceholder = "",
    categoryOrder = [],
    items = [],
    groupBy,
    getKey,
    getImage,
    getPdfUrl,
    getImageAlt,
    getTitle,
    getDetails,
    onCardClick,
    emptyMessage = ""
}) {
    const totalCount = items.length;
    const resolvedCountLabel = countLabel
        ? `${totalCount} ${countLabel}`
        : String(totalCount);
    const [searchQuery, setSearchQuery] = useState("");
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const isSearching = normalizedSearchQuery.length > 0;
    const filteredItems = useMemo(() => {
        if (!isSearching) {
            return items;
        }

        return items.filter((item) => {
            const details = getDetails?.(item) || [];
            const detailText = details
                .map((detail) => `${detail?.label || ""} ${detail?.value || ""}`.trim())
                .join(" ");
            const searchableText = [
                groupBy(item),
                getTitle(item),
                detailText
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedSearchQuery);
        });
    }, [getDetails, getTitle, groupBy, isSearching, items, normalizedSearchQuery]);
    const groupedItems = useMemo(() => {
        return filteredItems.reduce((groups, item) => {
            const groupName = groupBy(item)?.trim() || "Other";

            if (!groups[groupName]) {
                groups[groupName] = [];
            }

            groups[groupName].push(item);
            return groups;
        }, {});
    }, [filteredItems, groupBy]);

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
                <div className={`listingPageHeader ${styles.listingPageHeader}`}>
                    <div className={styles.headerTopRow}>
                        <div className={styles.headerTitleBlock}>
                            <div className={styles.headerTitleWrap}>
                                <h2 className="mainTitle">{title}</h2>
                                {totalCount > 0 && (
                                    <span className={styles.headerCount}>{resolvedCountLabel}</span>
                                )}
                            </div>
                        </div>

                        {actionLabel && actionTo && (
                            <Link to={actionTo} className={`profileActionButton ${styles.headerAction}`}>
                                {actionLabel}
                            </Link>
                        )}
                    </div>

                    {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}

                    {totalCount > 0 && (
                        <div className={styles.searchWrap}>
                            <label className={styles.searchField}>
                                <input
                                    type="search"
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder={searchPlaceholder || `Search ${title.toLowerCase()}`}
                                    aria-label={`Search ${title}`}
                                />
                                {isSearching && (
                                    <button
                                        type="button"
                                        className={styles.searchClear}
                                        onClick={() => setSearchQuery("")}
                                        aria-label={`Clear ${title} search`}
                                    >
                                        <span className="material-symbols-rounded" aria-hidden="true">
                                            close
                                        </span>
                                    </button>
                                )}
                                <span
                                    className={`material-symbols-rounded ${styles.searchIcon}`}
                                    aria-hidden="true"
                                >
                                    search
                                </span>
                            </label>

                            {isSearching && (
                                <p className={styles.searchMeta}>
                                    {filteredItems.length === 0
                                        ? `No matches found for "${searchQuery.trim()}".`
                                        : `Showing ${filteredItems.length} matching ${filteredItems.length === 1 ? "result" : "results"}.`}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {sortedGroups.length === 0 && (
                    <div className="emptyState">
                        {totalCount === 0
                            ? emptyMessage
                            : `No matching ${countLabel || "items"} found. Try a different search.`}
                    </div>
                )}

                {sortedGroups.map((groupName) => {
                    const isOpen = isSearching ? true : openGroups[groupName] ?? false;
                    const count = groupedItems[groupName].length;

                    return (
                        <section key={groupName} className={styles.groupSection}>
                            <button
                                type="button"
                                className={`${styles.groupHeader} ${isOpen ? styles.groupHeaderOpen : ""}`}
                                onClick={() => toggleGroup(groupName)}
                                aria-expanded={isOpen}
                            >
                                <span className={styles.groupTitleWrap}>
                                    <span className={styles.groupTitle}>{groupName}</span>
                                    <span className={styles.groupCount}>{count}</span>
                                </span>
                                <span
                                    className={`material-symbols-rounded ${styles.groupChevron} ${isOpen ? styles.groupChevronOpen : ""}`}
                                    aria-hidden="true"
                                >
                                    expand_more
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
