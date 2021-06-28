import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../screens/StartMeeting/StartMeetingScreen";

export default function Sidebar(props) {
  const user = useSelector((state) => state.userReducer);
  const [msg, setMsg] = useState("");

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
        user,
        meetId: props.meetId,
        time: new Date().toLocaleTimeString(),
      });
    setMsg("");
  };

  return (
    <div
      className="sidebar col s12 m3 white"
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
        <>
          <div className="chats">
            {props.meetingChats.map((message, index) => {
              return (
                <div
                  className={`message ${
                    message.user._id === user._id ? "rightmsg" : "leftmsg"
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
              <textarea
                id="textarea"
                className="materialize-textarea"
                value={msg}
                onChange={(e) => {
                  setMsg(e.target.value);
                }}
              ></textarea>
              <label htmlFor="textarea">Send a message...</label>
            </div>
            <div>
              <button
                className="btn-flat btn-large transparent"
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
