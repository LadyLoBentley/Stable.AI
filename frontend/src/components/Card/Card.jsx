import styles from "./Card.module.css";

function Card({
    image,
    imageAlt = "Card image",
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
        >
            <div className={styles.cardBody}>
                <img
                    className={styles.cardImage}
                    src={image}
                    alt={imageAlt}
                />

                <h2 className={styles.cardTitle}>{title}</h2>

                <div className={styles.cardText}>
                    {details.map((detail, index) => (
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