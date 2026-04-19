import ChatbotIcon from "./ChatbotIcon.jsx";
import styles from "./Chatbot.module.css";

const ChatMessage = ({ chat }) => {
  const uniqueSources = Array.from(
    new Map(
      (chat.sources || [])
        .filter((source) => source.file_name)
        .map((source) => [source.file_name, source])
    ).values()
  );

  const horseLinks = chat.horse_links || [];

  return (
    <div
      className={
        chat.role === "bot"
          ? styles.botMessage
          : styles.userMessage
      }
    >
      {chat.role === "bot" && <ChatbotIcon />}

      <div className={styles.messageContent}>
        <p>{chat.text}</p>

        {chat.role === "bot" && horseLinks.length > 0 && (
          <div className={styles.horseLinkList}>
            {horseLinks.map((link, index) => (
              <a
                key={index}
                href={`${window.location.origin}/horses/${link.horse_id}`}
                target="_blank"
                rel="noreferrer"
                className={styles.horseProfileLink}
              >
                <span className="material-symbols-rounded">pets</span>
                View {link.name}&apos;s full profile
              </a>
            ))}
          </div>
        )}

        {chat.role === "bot" && uniqueSources.length > 0 && (
          <div className={styles.sourceList}>
            <span className={styles.sourceLabel}>Sources:</span>
            {uniqueSources.map((source, index) => (
              <span key={index} className={styles.sourceItem}>
                {source.file_name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;