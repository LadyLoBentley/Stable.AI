import React, { useEffect, useMemo, useRef, useState } from "react";
import InfoTip from "../InfoTip/InfoTip.jsx";

function TagSearchField({
    label,
    value = [],
    onChange,
    options = [],
    placeholder = "Type to search or add...",
    maxItems = 20,
    allowCustom = true,
    noResultsText = "Press Enter to add this as a custom entry",
    tipTitle = "",
    tipBody = ""
}) {
    const [query, setQuery] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [message, setMessage] = useState("");
    const suggestionsRef = useRef(null);

    const selectedItems = useMemo(
        () => (Array.isArray(value) ? value.filter(Boolean) : []),
        [value]
    );

    const filteredSuggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        return options
            .filter((option) => option.toLowerCase().includes(q))
            .filter(
                (option) =>
                    !selectedItems.some(
                        (item) => item.toLowerCase() === option.toLowerCase()
                    )
            )
            .slice(0, 8);
    }, [query, options, selectedItems]);

    useEffect(() => {
        const container = suggestionsRef.current;
        if (!container) return;

        const el = container.querySelector(`[data-idx="${highlightIndex}"]`);
        if (!el) return;

        el.scrollIntoView({ block: "nearest" });
    }, [highlightIndex, filteredSuggestions.length]);

    function addItem(rawValue) {
        const cleaned = rawValue.trim();
        if (!cleaned) return;

        const alreadyExists = selectedItems.some(
            (item) => item.toLowerCase() === cleaned.toLowerCase()
        );

        if (alreadyExists) {
            setMessage("That item has already been added.");
            return;
        }

        if (selectedItems.length >= maxItems) {
            setMessage(`Limit reached (${maxItems}). Remove one to add another.`);
            return;
        }

        onChange([...selectedItems, cleaned]);
        setQuery("");
        setHighlightIndex(0);
        setMessage("");
    }

    function removeItem(itemToRemove) {
        onChange(selectedItems.filter((item) => item !== itemToRemove));
        setMessage("");
    }

    function handleEnter() {
        const cleaned = query.trim();
        if (!cleaned) return;

        if (filteredSuggestions.length > 0) {
            addItem(filteredSuggestions[highlightIndex]);
            return;
        }

        if (allowCustom) {
            addItem(cleaned);
        }
    }

    return (
        <div className="tagSearchField">
            <div className="tagSearchLabelRow">
                <label className="tagSearchLabel">
                    <b>{label}: </b>
                </label>

                {(tipTitle || tipBody) && (
                    <InfoTip
                        label={`${label} help`}
                        title={tipTitle}
                        body={tipBody}
                    />
                )}
            </div>

            {selectedItems.length > 0 && (
                <div className="tagChipGroup">
                    {selectedItems.map((item) => (
                        <span key={item} className="tagChip">
                            {item}
                            <button
                                type="button"
                                className="tagChipRemove"
                                onClick={() => removeItem(item)}
                                aria-label={`Remove ${item}`}
                                title="Remove"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="tagSearchInputWrap">
                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setHighlightIndex(0);
                        setMessage("");
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Backspace" && !query && selectedItems.length > 0) {
                            e.preventDefault();
                            removeItem(selectedItems[selectedItems.length - 1]);
                            return;
                        }

                        if (e.key === "ArrowDown" && filteredSuggestions.length > 0) {
                            e.preventDefault();
                            setHighlightIndex((i) =>
                                Math.min(i + 1, filteredSuggestions.length - 1)
                            );
                            return;
                        }

                        if (e.key === "ArrowUp" && filteredSuggestions.length > 0) {
                            e.preventDefault();
                            setHighlightIndex((i) => Math.max(i - 1, 0));
                            return;
                        }

                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleEnter();
                            return;
                        }

                        if (e.key === "Escape") {
                            e.preventDefault();
                            setQuery("");
                            setHighlightIndex(0);
                        }
                    }}
                    placeholder={placeholder}
                    className="tagSearchInput"
                />

                {query.trim() && filteredSuggestions.length > 0 && (
                    <div ref={suggestionsRef} className="tagSuggestions">
                        {filteredSuggestions.map((item, index) => (
                            <button
                                key={item}
                                data-idx={index}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => addItem(item)}
                                className={
                                    index === highlightIndex
                                        ? "tagSuggestionItem highlighted"
                                        : "tagSuggestionItem"
                                }
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}

                {query.trim() && filteredSuggestions.length === 0 && allowCustom && (
                    <div className="tagNoResults">
                        {noResultsText}
                    </div>
                )}
            </div>

            {message && <div className="tagFieldMessage">{message}</div>}
        </div>
    );
}

export default TagSearchField;
