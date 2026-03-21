import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

import JoinRoom from "./components/JoinRoom";
import ChatBody from "./components/ChatBody";
import ChatFooter from "./components/ChatFooter";
import OnlineUsers from "./components/OnlineUsers";
import WelcomeScreen from "./components/WelcomeScreen";

// ✅ YOUR DEPLOYED BACKEND URL
const BASE_URL = "https://chat-app-i7h8.onrender.com";

// ✅ SOCKET CONNECTION
const socket = io(BASE_URL);

function App() {
  const [started, setStarted] = useState(false);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const [typingUser, setTypingUser] = useState("");
  const [users, setUsers] = useState([]);

  const chatBodyRef = useRef(null);
  const audioRef = useRef(new Audio("/send.wav"));

  useEffect(() => {
    audioRef.current.load();
  }, []);

  const playSound = () => {
    try {
      const sound = audioRef.current;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch {}
  };

  // ✅ JOIN ROOM
  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", { username, room });
      setMessageList([]);
    }
  };

  // ✅ SEND MESSAGE
  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
        status: "sent",
        date: new Date().toDateString(),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);

      playSound();
      setMessage("");
      socket.emit("stop_typing", room);
    }
  };

  // ✅ RECEIVE MESSAGE
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);

      if (data.author !== username) {
        playSound();
      }
    });

    return () => socket.off("receive_message");
  }, [username]);

  // ✅ ONLINE USERS
  useEffect(() => {
    socket.on("room_users", (users) => {
      setUsers(users);
    });

    return () => socket.off("room_users");
  }, []);

  // ✅ SEEN UPDATE
  useEffect(() => {
    socket.on("update_seen", () => {
      setMessageList((list) =>
        list.map((msg) =>
          msg.author === username ? { ...msg, status: "seen" } : msg
        )
      );
    });

    return () => socket.off("update_seen");
  }, [username]);

  // ✅ SEND SEEN
  useEffect(() => {
    if (room && messageList.length > 0) {
      socket.emit("message_seen", { room });
    }
  }, [messageList, room]);

  // ✅ LOAD OLD MESSAGES FROM BACKEND
  useEffect(() => {
    if (room !== "") {
      fetch(`${BASE_URL}/messages/${room}`)
        .then((res) => res.json())
        .then((data) => setMessageList(Array.isArray(data) ? data : []))
        .catch(() => setMessageList([]));
    }
  }, [room]);

  // ✅ TYPING
  useEffect(() => {
    socket.on("show_typing", (user) => setTypingUser(user));
    socket.on("hide_typing", () => setTypingUser(""));

    return () => {
      socket.off("show_typing");
      socket.off("hide_typing");
    };
  }, []);

  // ✅ AUTO SCROLL
  useEffect(() => {
    chatBodyRef.current?.scrollTo(
      0,
      chatBodyRef.current.scrollHeight
    );
  }, [messageList]);

  return (
    <>
      {!started ? (
        <WelcomeScreen onStart={() => setStarted(true)} />
      ) : (
        <div className="app-container">
          <div className="main-container">

            {/* CHAT */}
            <div className="chat">

              {/* HEADER */}
              <div className="chat-header">
                💬 Chat App
              </div>

              {/* JOIN ROOM */}
              <JoinRoom
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                joinRoom={joinRoom}
              />

              {/* ONLINE USERS */}
              <OnlineUsers users={users} />

              {/* CHAT BODY */}
              <ChatBody
                messageList={messageList}
                username={username}
                chatBodyRef={chatBodyRef}
              />

              {/* TYPING */}
              {typingUser && typingUser !== username && (
                <div className="typing">
                  {typingUser} typing...
                </div>
              )}

              {/* FOOTER */}
              <ChatFooter
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                socket={socket}
                username={username}
                room={room}
              />

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default App;