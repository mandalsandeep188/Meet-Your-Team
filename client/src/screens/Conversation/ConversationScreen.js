import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import { socket } from "../StartMeeting/StartMeetingScreen";
import Loader from "../../components/Loader";
import Chats from "../../components/Chats";
import Modal from "../../components/Modal";
import Info from "../../components/Info";
import M from "materialize-css";
import "./Conversation.css";

export default function ConversationScreen() {
  const user = useRef(JSON.parse(localStorage.getItem("user")));
  const send = useRef();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConservation] = useState(null);
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const conversationId = useRef(id);
  const [chats, setChats] = useState([]);
  const history = useHistory();
  const location = useLocation();

  // css library init
  useEffect(() => {
    M.AutoInit();
  }, []);

  useEffect(() => {
    // fetch all conversations
    getConversations();

    // first time joining this conversation
    socket.on("user-joined", () => {
      getConversations();
    });

    // receive event
    socket.on("receive-message", () => {
      receiveChats();
    });
  }, []);

  // get all joined/created conversations
  const getConversations = () => {
    fetch("/getConversations", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          history.replace(`/login?context=${location.pathname}`);
        } else {
          setConversations(data.conversations);
          // join conversation
          if (conversationId.current && conversationId.current.length === 8) {
            getConversation();
          } else if (
            conversationId.current &&
            conversationId.current.length !== 0
          ) {
            M.toast({
              html: "Invalid conversation link",
              classes: "#c62828 red darken-3",
            });
            history.replace("/");
          } else setLoader(false);
        }
      });
  };

  // get a particular selected conversation
  const getConversation = () => {
    fetch(`/getConversation/${conversationId.current}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedConservation(data.conversation);
      });
  };

  // join conversation
  const joinConversation = () => {
    socket.emit("joinConversation", {
      id: user.current._id,
      conversationId: conversationId.current,
      user: user.current,
    });
  };

  // when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setLoader(true);
      conversationId.current = selectedConversation.conversationId;
      joinConversation();
      receiveChats();
    }
  }, [selectedConversation]);

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
          conversationId: conversationId.current,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          data.message.sender = user.current;
          setChats([...chats, data.message]);
          socket.emit("sent-message", conversationId.current);
          let objDiv = document.getElementsByClassName("chats")[0];
          if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
        });
      setMsg("");
      send.current.focus();
    }
  };

  // receive chats
  const receiveChats = () => {
    fetch("/receiveMessage", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: conversationId.current,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setChats(data.chats);
        setLoader(false);
        let objDiv = document.getElementsByClassName("chats")[0];
        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
      });
  };

  // when loader disappeared
  useEffect(() => {
    if (!loader) {
      let objDiv = document.getElementsByClassName("chats")[0];
      if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [loader]);

  return (
    <div className="conversation">
      <div
        className="row"
        style={{ margin: "0", padding: "0", border: "1px solid lightgray" }}
      >
        {/* conversations to choose */}
        <h5 className="col s10 m7">
          {selectedConversation ? (
            <>
              Conversation:{" "}
              <i className="teal-text">{selectedConversation.name}</i>
            </>
          ) : (
            "Choose a conversation"
          )}
        </h5>
        <div className="col s2 m5 choose">
          <button className="btn dropdown-trigger" data-target="conversations">
            <span className=" hide-on-small-and-down">Choose conversation</span>
            <i className="material-icons hide-on-med-and-up">arrow_drop_down</i>
          </button>
        </div>
        <ul id="conversations" className="dropdown-content">
          {conversations.map((conversation) => {
            return (
              <li key={conversation._id}>
                <Link
                  to={`/conversation/${conversation.conversationId}`}
                  replace={true}
                  onClick={() => setSelectedConservation(conversation)}
                >
                  {conversation.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* content to show when a conversation is selected */}
      <div className="row" style={{ margin: "0", padding: "0" }}>
        {selectedConversation ? (
          loader ? (
            <Loader />
          ) : (
            <>
              {/* members mobile*/}
              <div className="col s12 hide-on-med-and-up join-mobile">
                <button className="btn modal-trigger" data-target="members">
                  See members
                </button>
                <Link to={`/meet/${conversationId.current}`} className="btn">
                  Join Meeting
                </Link>
                <button
                  className="btn-floating btn modal-trigger"
                  data-target="info"
                >
                  <i className="material-icons">info_outline</i>
                </button>
              </div>
              <Modal id="members" modalClass="hide-on-med-and-up">
                <h6>Members</h6>
                <ul className="collection members">
                  {selectedConversation.members.map((member) => {
                    return (
                      <li className="collection-item avatar" key={member._id}>
                        <img
                          className="circle"
                          src={member.profileImage}
                          alt={member.name}
                        />
                        <span className="title">{member.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </Modal>

              {/* members pc */}
              <div className="col s3 hide-on-small-and-down">
                <h6>Members</h6>
                <ul className="collection members">
                  {selectedConversation.members.map((member) => {
                    return (
                      <li className="collection-item avatar" key={member._id}>
                        <img
                          className="circle"
                          src={member.profileImage}
                          alt={member.name}
                        />
                        <span className="title">{member.name}</span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to={`/meet/${conversationId.current}`}
                  className="join btn"
                >
                  Join Meeting
                </Link>
                <button
                  className="btn-floating btn modal-trigger"
                  data-target="info"
                >
                  <i className="material-icons">info_outline</i>
                </button>
              </div>
              <Info conversation={selectedConversation} screen="Conversation" />

              {/* chats */}
              <div className="col s12 m9">
                <Chats
                  setMsg={setMsg}
                  sendMessage={sendMessage}
                  chats={chats}
                  user={user}
                  msg={msg}
                  send={send}
                />
              </div>
            </>
          )
        ) : (
          <>
            {loader ? (
              <Loader />
            ) : (
              // when no conversation selected
              <h6 className="center-align col s12 show">
                Your chats will be shown here! <br />
                Select a conversation to start chatting
              </h6>
            )}
          </>
        )}
      </div>
    </div>
  );
}
