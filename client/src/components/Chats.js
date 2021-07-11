import React from "react";
import Message from "./Message";

export default function Chats(props) {
  return (
    <>
      <div className="chats">
        {props.chats.map((message) => {
          return (
            <Message message={message} key={message._id} user={props.user} />
          );
        })}
      </div>
      {/* message box to sent text */}
      <div className="send">
        <div className="input-field">
          <input
            id="message"
            ref={props.send}
            className="validate"
            value={props.msg}
            placeholder="Send a message..."
            onChange={(e) => {
              props.setMsg(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            className="btn-flat btn-large transparent"
            style={{ marginLeft: "10px" }}
            onClick={props.sendMessage}
          >
            <i className="material-icons teal-text">send</i>
          </button>
        </div>
      </div>
    </>
  );
}
