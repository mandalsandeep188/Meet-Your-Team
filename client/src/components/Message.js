import React from "react";

// Text message component

export default function Message({ message, user }) {
  return (
    <div
      className={`message ${
        message.sender._id === user.current._id ? "rightmsg" : "leftmsg"
      }`}
    >
      <div>
        <span style={{ fontWeight: "bold" }}>{message.sender.name}</span>
      </div>
      <span style={{ fontSize: "14px" }}>{message.text}</span>
      <div className="right-align">
        <span style={{ fontSize: "9px" }}>
          {new Date(message.createdAt).toLocaleTimeString().substr(0, 5)}
          {" | "}
          {new Date(message.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
