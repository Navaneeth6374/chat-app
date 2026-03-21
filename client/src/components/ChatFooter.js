function ChatFooter({ message, setMessage, sendMessage, socket, username, room }) {

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { username, room });

    setTimeout(() => {
      socket.emit("stop_typing", room);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-footer">
      <input
        value={message}
        onChange={handleTyping}
        onKeyDown={handleKeyDown}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatFooter;