import { useState } from "react";

import chatbotIcon from "../../assets/chatbotIcon.png";
import ChatForm from "../Chatbot/ChatForm";
import ChatMessage from "../Chatbot/ChatMessage";
import { askRag } from "../../utils/ragApi";

import styles from "./Chatbot.module.css";

function Chatbot() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const suggestedQuestions = [
    {
      label: "Ask about the horses",
      question: "What horse records are currently in the system?",
    },
    {
      label: "Ask about owner information",
      question: "What owner information is in the database?",
    },
    {
      label: "Ask about medical records",
      question: "What medical records are on file?",
    },
    {
      label: "Ask about feeding or barn rules",
      question: "What should volunteers check before feeding hay?",
    },
    {
      label: "Ask about a specific horse",
      question: "Can I ask about a specific horse by name?",
    },
  ];

  const generateBotResponse = async (history) => {
    try {
      const latestUserMessage = history[history.length - 1]?.text;

      if (!latestUserMessage) return;

      const result = await askRag(latestUserMessage);

      setChatHistory((prev) => {
        const updated = [...prev];
        const thinkingIndex = updated.findIndex(
          (msg) => msg.role === "bot" && msg.text === "Thinking..."
        );

        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            role: "bot",
            text: result.answer,
            sources: result.sources || [],
          };
        } else {
          updated.push({
            role: "bot",
            text: result.answer,
            sources: result.sources || [],
          });
        }

        return updated;
      });
    } catch {
      setChatHistory((prev) => {
        const updated = [...prev];
        const thinkingIndex = updated.findIndex(
          (msg) => msg.role === "bot" && msg.text === "Thinking..."
        );

        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            role: "bot",
            text: "Sorry, something went wrong.",
          };
        } else {
          updated.push({
            role: "bot",
            text: "Sorry, something went wrong.",
          });
        }

        return updated;
      });
    }
  };

  const handleSuggestedQuestion = (question) => {
    const updatedHistory = [...chatHistory, { role: "user", text: question }];

    setChatHistory([
      ...updatedHistory,
      { role: "bot", text: "Thinking..." },
    ]);

    generateBotResponse(updatedHistory);
  };

  return (
    <div className={!showChatbot ? styles.container : styles.showChatbot}>
      <button
        className={styles.buttonToggler}
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        <span className={`material-symbols-rounded ${styles.openIcon}`}>
          mode_comment
        </span>
        <span className={`material-symbols-rounded ${styles.closeIcon}`}>
          close
        </span>
      </button>

      <div
        className={`${styles.chatbotPopup} ${
          isMinimized ? styles.minimized : ""
        }`}
      >
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
            onClick={() => setIsMinimized((prev) => !prev)}
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            <span className="material-symbols-rounded">
              {isMinimized ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </span>
          </button>
        </div>

        <div className={styles.chatBody}>
          <div className={styles.botMessage}>
            <img
              src={chatbotIcon}
              alt="Chatbot"
              className={styles.messageIcon}
            />
            <div className={styles.messageContent}>
              <p>
                Hey there! 👋
                <br />
                How can I help you today?
              </p>

              {chatHistory.length === 0 && (
                <div className={styles.suggestedQuestions}>
                  {suggestedQuestions.map((item, index) => (
                    <button
                      key={index}
                      className={styles.suggestionChip}
                      onClick={() => handleSuggestedQuestion(item.question)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className={styles.chatFooter}>
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
