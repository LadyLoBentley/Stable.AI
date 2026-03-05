import ChatbotIcon from "./ChatbotIcon.jsx";
import styles from "./Chatbot.module.css";

const ChatMessage = ({chat}) => {

    return (
        <div
            className={
                chat.role === "bot"
                    ? styles.botMessage
                    : styles.userMessage
            }
        >
            {chat.role === "bot" && <ChatbotIcon />}
            <p>{chat.text}</p>
        </div>
    )
}

export default ChatMessage;