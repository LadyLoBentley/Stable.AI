import {useState} from "react";

import chatbotIcon from '../../assets/chatbotIcon.png'
import ChatForm from '../Chatbot/ChatForm'
import ChatMessage from '../Chatbot/ChatMessage'

import styles from "./Chatbot.module.css";

function Chatbot() {

    const [isMinimized, setIsMinimized] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [showChatbot, setShowChatbot] = useState(false);
    const generateBotResponse = (history) => {console.log(history);}

    return (
        <div
            className={!showChatbot ? styles.container : styles.showChatbot}
        >

            <button
                className={styles.buttonToggler}
                onClick={() => setShowChatbot(prev => !prev)}
            >
                <span
                    className={`material-symbols-rounded ${styles.openIcon}`}
                >
                    mode_comment
                </span>
                <span
                    className={`material-symbols-rounded ${styles.closeIcon}`}
                >
                    close
                </span>
            </button>

            <div className={`${styles.chatbotPopup} ${isMinimized ? styles.minimized : ''}`}>

                {/* Chatbot Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.HeaderInfo}>
                        <img
                            src={chatbotIcon}
                             alt="Chatbot"
                             className={styles.headerIcon}
                        />
                        <h2 className={styles.logoText}>Chatbot</h2>
                    </div>

                    <button
                        className={styles.HeaderButton}
                        onClick={() => setIsMinimized(prev => !prev)}
                        aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                    >
                        <span className="material-symbols-rounded">
                            {isMinimized ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                    </button>
                </div>

                {/* Chatbot Body  */}
                <div className={styles.chatBody}>
                    <div
                        className={styles.botMessage}
                    >
                        <img src={chatbotIcon}
                             alt="Chatbot"
                             className={styles.messageIcon}/>
                        <p>Hey there! 👋<br />
                        How can I help you today?</p>
                    </div>

                    {/* Dynamically renders the chat history */}
                    {chatHistory.map((chat, index) => (
                        <ChatMessage
                            key={index}
                            chat={chat}
                        />
                    ))}
                </div>

                {/* Chatbot Footer  */}
                <div
                className={styles.chatFooter}
                >
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                    />

                </div>
            </div>
        </div>
    );
}

export default Chatbot;