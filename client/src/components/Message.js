import React from "react";

export default function Message({ message, user }) {
  return (
    <div
      className={`message ${
        message.sender._id === user.current._id ? "rightmsg" : "leftmsg"
      }`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>
          {message.sender.name}
        </span>
        <span style={{ fontSize: "10px" }}>
          {new Date(message.createdAt).toLocaleTimeString().substr(0, 5)}
          {" | "}
          {new Date(message.createdAt).toLocaleDateString()}
        </span>
      </div>
      <span style={{ fontSize: "14px" }}>{message.text}</span>
    </div>
  );
}
