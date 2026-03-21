import React from "react";
import { motion } from "framer-motion";

function ChatBody({ messageList, username, chatBodyRef }) {
  const safeList = Array.isArray(messageList) ? messageList : [];

  if (safeList.length === 0) {
    return <div className="empty-chat">Start conversation</div>;
  }

  let lastDate = "";

  return (
    <div className="chat-body" ref={chatBodyRef}>
      {safeList.map((msg, index) => {
        const isMe = msg.author === username;
        const showDate = msg.date !== lastDate;
        lastDate = msg.date;

        return (
          <React.Fragment key={index}>
            {showDate && (
              <div className="date-divider">{msg.date}</div>
            )}

            <motion.div
              className={`message-container ${
                isMe ? "my-container" : "other-container"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!isMe && (
                <div className="avatar other-avatar">
                  {msg.author?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className={`message ${isMe ? "my-message" : "other-message"}`}>
                <span className="author">{msg.author}</span>
                <span className="text">{msg.message}</span>

                <span className="time">
                  {msg.time}
                  {isMe && (
                    <span className="status">
                      {msg.status === "sent" && " ✔"}
                      {msg.status === "delivered" && " ✔✔"}
                      {msg.status === "seen" && " ✔✔"}
                    </span>
                  )}
                </span>
              </div>

              {isMe && (
                <div className="avatar my-avatar">
                  {msg.author?.charAt(0).toUpperCase()}
                </div>
              )}
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ChatBody;