
function Toggle({ value, onChange, error }) {
    return (
        <div className="locationToggleWrapper">
            <label>Horse resides in:</label>
            <div className="locationToggle">
                <button
                    type="button"
                    className={value === "stall" ? "toggleOption active" : "toggleOption"}
                    onClick={() => onChange("stall")}
                >
                    Stall
                </button>

                <button
                    type="button"
                    className={value === "pasture" ? "toggleOption active" : "toggleOption"}
                    onClick={() => onChange("pasture")}
                >
                    Pasture
                </button>
            </div>

            {error && <p className="fieldError">{error}</p>}
        </div>
    );
}

export default Toggle;