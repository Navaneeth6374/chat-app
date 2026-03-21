import React from "react";
import "./WelcomeScreen.css";

function WelcomeScreen({ onStart }) {
  return (
    <div className="glass-bg">
      <div className="glass-card">

        {/* ✅ CUSTOM LOGO */}
        <div className="logo">
  <img src="/logo.png" alt="Chat Logo" className="logo-img" />
</div>

        <h1>Chat App</h1>
        <p>Connect. Chat. Enjoy </p>

        <button onClick={onStart}>Start Chatting</button>

      </div>
    </div>
  );
}

export default WelcomeScreen;