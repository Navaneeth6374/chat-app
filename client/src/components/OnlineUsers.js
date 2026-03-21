import React from "react";

function OnlineUsers({ users }) {
  return (
    <div className="users-panel">
      <h4>🟢 Online Users</h4>
      {users.map((user, index) => (
        <div key={index} className="user-item">
          <span className="dot"></span>
          {user.username}
        </div>
      ))}
    </div>
  );
}

export default OnlineUsers;