import styles from "./UserGreeting.module.css";

function UserGreeting(props) {


    const welcomeMessage = <h2 className={styles.welcomeMessage}>
                                    Howdy {props.name}
                                    </h2>

    const loginPrompt = <h2 className={styles.loginPrompt}>
                                 Please log in to continue
                                 </h2>

    return (props.isLoggedIn ? welcomeMessage : loginPrompt)
}

export default UserGreeting;