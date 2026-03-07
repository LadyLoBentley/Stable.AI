import styles from "./Chatbot.module.css";
import {useRef} from "react";

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {

    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();

        if (!userMessage) return;

        console.log(userMessage);
        inputRef.current.value = "";

        // Update chat history with the user's message
        setChatHistory(history => [...history, {role: "user", text: userMessage}]);

        // Add a "Thinking..." __init__.py for the bot's response
        setTimeout(() => {
            // Add a "Thinking..." __init__.py for the bot's response
            setChatHistory((history) => [...history, {role: "bot", text: "Thinking..."}]);

            // Call function to generate bot's response
            generateBotResponse([...chatHistory, {role: "user", text: userMessage}]);
        }, 600);
    }

    return(
        <form
            action="#"
            className={styles.chatForm}
            onSubmit={handleFormSubmit}
        >
            <input
                ref={inputRef}
                type="text"
                placeholder="Enter your message here..."
                className={styles.chatInput}
                required
            />
            <button className={styles.FooterButton}>
                <span className="material-symbols-rounded">
                    keyboard_arrow_up
                </span>
            </button>
        </form>
    );
};

export default ChatForm;