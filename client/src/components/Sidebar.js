import React, { useEffect, useRef, useState } from "react";
import Chats from "./Chats";
import { socket } from "../screens/StartMeeting/StartMeetingScreen";

export default function Sidebar(props) {
  const user = useRef(JSON.parse(localStorage.getItem("user")));
  const [msg, setMsg] = useState("");
  const send = useRef();

  useEffect(() => {
    // receive message socket event
    socket.on("receive-message", () => {
      fetch("/receiveMessage", {
        method: "post",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: props.meetId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          props.receive(data.chats);
          let objDiv = document.getElementsByClassName("chats")[0];
          if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
        });
    });
  }, []);

  // send chat message
  const sendMessage = () => {
    const message = msg.trim();
    if (message.length !== 0) {
      fetch(`/sendMessage`, {
        method: "post",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msg: message,
          conversationId: props.meetId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          data.message.sender = user.current;
          props.receive([...props.meetingChats, data.message]);
          socket.emit("sent-message", props.meetId);
          let objDiv = document.getElementsByClassName("chats")[0];
          if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
        });
      setMsg("");
      send.current.focus();
    }
  };

  // Sidebar show participants or chats during meeting

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
        <Chats
          setMsg={setMsg}
          sendMessage={sendMessage}
          chats={props.meetingChats}
          user={user}
          msg={msg}
          send={send}
        />
      )}
    </div>
  );
}
