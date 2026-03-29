import styles from "./Card.module.css";

function Card({
    image,
    pdfUrl,
    imageAlt = "Card preview",
    title,
    details = [],
    onClick
}) {
    return (
        <div
            className={styles.card}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            <div className={styles.cardBody}>
                {pdfUrl && (
                    <iframe
                        className={styles.cardImage}
                        src={pdfUrl}
                        title={`${title} preview`}
                    />
                )}

                {!pdfUrl && image && (
                    <img
                        className={styles.cardImage}
                        src={image}
                        alt={imageAlt}
                    />
                )}

                <h2 className={styles.cardTitle}>{title}</h2>

                <div className={styles.cardText}>
                    {details?.map((detail, index) => (
                        <p key={index}>
                            <b>{detail.label}:</b> {detail.value}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Card;