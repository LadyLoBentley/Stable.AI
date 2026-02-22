

function UserGreeting(props) {

    const welcomeMessage = <h2 className="welcome-message">
                                    Howdy {props.name}
                                    </h2>

    const loginPrompt = <h2 className="login-prompt">
                                 Please log in to continue
                                 </h2>

    return (props.isLoggedIn ? welcomeMessage : loginPrompt)
}

export default UserGreeting;