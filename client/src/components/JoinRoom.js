import React from "react";

function JoinRoom({ username, setUsername, room, setRoom, joinRoom }) {
  return (
    <div style={{ padding: "10px" }}>
      <input
        placeholder="Enter Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Enter Room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <button onClick={joinRoom}>Join</button>

      {room && <p>Joined Room: {room}</p>}
    </div>
  );
}

export default JoinRoom;