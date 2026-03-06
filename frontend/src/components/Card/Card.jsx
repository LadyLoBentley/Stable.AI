import Button from "../Button/Button.jsx"

import styles from "./Card.module.css"

function Card(props) {

    const handleClick = (e) => console.log(e);

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <img
                    className={styles.cardImage}
                    src={props.image}
                    alt="Spirit the horse"
                    onClick={(e) => handleClick(e)}
                />
                <h2 className={styles.cardTitle}>{props.name}</h2>
                <p className={styles.cardText}>
                    <b>Status:</b> {props.status} <br />
                    <b>Location:</b> {props.location}
                </p>

            </div>
        </div>
    );
}

export default Card;