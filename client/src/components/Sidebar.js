import React, { useEffect, useRef, useState } from "react";
import { socket } from "../screens/StartMeeting/StartMeetingScreen";

export default function Sidebar(props) {
  const user = useRef(JSON.parse(localStorage.getItem("user")));
  const [msg, setMsg] = useState("");
  const send = useRef();

  useEffect(() => {
    socket.on("receiveMessage", (meetingChats) => {
      props.receive(meetingChats);
      let objDiv = document.getElementsByClassName("chats")[0];
      objDiv.scrollTop = objDiv.scrollHeight;
    });
  }, []);

  // send chat message
  const sendMessage = () => {
    const message = msg.trim();
    if (message.length != 0)
      socket.emit("sendMessage", {
        msg: message,
        user: user.current,
        meetId: props.meetId,
        time: new Date().toLocaleTimeString(),
      });
    setMsg("");
    send.current.focus();
  };

  return (
    <div
      className="sidebar col s12 m12 l3 white"
      style={{ display: props.toShow === "close" ? "none" : "block" }}
    >
      <div className="row" style={{ margin: "0px", padding: "0px" }}>
        <div className="col s10">
          <h5 className="collection-header">
            {props.toShow === "users" ? "Participants" : "Chats"}
          </h5>
        </div>
        <div className="col s2" style={{ padding: "10px" }}>
          <button
            className="btn-floating btn-small red"
            onClick={() => props.toggler("close")}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
      </div>
      {props.toShow === "users" ? (
        // users
        <ul className="collection">
          {props.meetingUsers.map((user) => {
            return (
              <li className="collection-item avatar" key={user._id}>
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="circle"
                />
                <span className="title">{user.name}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        // chats
        <>
          <div className="chats">
            {props.meetingChats.map((message, index) => {
              return (
                <div
                  className={`message ${
                    message.user._id === user.current._id
                      ? "rightmsg"
                      : "leftmsg"
                  }`}
                  key={index}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                      {message.user.name}
                    </span>
                    <span style={{ fontSize: "10px" }}>{message.time}</span>
                  </div>
                  <span style={{ fontSize: "14px" }}>{message.text}</span>
                </div>
              );
            })}
          </div>
          <div className="send">
            <div className="input-field">
              <input
                id="message"
                ref={send}
                className="validate"
                value={msg}
                placeholder="Send a message..."
                onChange={(e) => {
                  setMsg(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                className="btn-flat btn-large transparent"
                style={{ marginLeft: "10px" }}
                onClick={sendMessage}
              >
                <i className="material-icons teal-text">send</i>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
