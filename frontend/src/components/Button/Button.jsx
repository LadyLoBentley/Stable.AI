import styles from './Button.module.css';

function Button(props) {
    const variant = props.variant === "secondary"
        ? styles.secondary
        : props.variant === "danger"
        ? styles.danger
        : "";

    return (
        <button
            type={props.type || "button"}
            className={`${styles.button} ${variant}`.trim()}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.label}
        </button>
    );
}

export default Button;