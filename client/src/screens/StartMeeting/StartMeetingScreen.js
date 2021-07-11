import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./StartMeeting.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { setStreamState } from "../../redux/actions/streamActions";
import M from "materialize-css";
import config from "../../config/keys";

export const socket = io(config.SERVER);

export default function StartMeetingScreen() {
  const [stream, setStream] = useState(null);
  const [videoStatus, setVideoStatus] = useState("videocam");
  const [audioStatus, setAudioStatus] = useState("mic");
  const [joinId, setJoinId] = useState("");
  const [name, setName] = useState("");
  const [loader, setLoader] = useState(true);
  const preview = useRef();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    M.AutoInit();
    fetch("/startmeet", {
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
          startStream();
        }
      });
  }, []);

  const startStream = () => {
    const myVideo = preview.current;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);
      });
  };

  // Initialize video preview
  const addVideoStream = (video, stream) => {
    setStream(stream);
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      setLoader(false);
    });
  };

  // video controls
  const toggleVideo = () => {
    if (videoStatus === "videocam") {
      setVideoStatus("videocam_off");
      stream.getVideoTracks()[0].enabled = false;
    } else {
      stream.getVideoTracks()[0].enabled = true;
      setVideoStatus("videocam");
    }
  };
  const toggleAudio = () => {
    if (audioStatus === "mic") {
      setAudioStatus("mic_off");
      stream.getAudioTracks()[0].enabled = false;
    } else {
      stream.getAudioTracks()[0].enabled = true;
      setAudioStatus("mic");
    }
  };

  // create new meeting and join directly
  const newMeeting = () => {
    const streamState = {
      videoStatus,
      audioStatus,
    };
    dispatch(setStreamState(streamState));
    socket.emit("newMeeting", name);
    socket.on("newMeeting", (data) => {
      history.push(`/meet/${data.meetId}`);
    });
  };

  // join meeting directly
  const joinMeeting = () => {
    let meetId = joinId;
    meetId = meetId.slice(meetId.lastIndexOf("/") + 1);
    if (meetId.length === 8) {
      const streamState = {
        videoStatus,
        audioStatus,
      };
      dispatch(setStreamState(streamState));
      history.push(`/meet/${meetId}`);
    } else {
      M.toast({ html: "Invalid meet link", classes: "#c62828 red darken-3" });
    }
  };

  // new conversation creation
  const newConversation = () => {
    socket.emit("newConversation", name);
    socket.on("newConversation", (data) => {
      history.push(`/conversation/${data.conversationId}`);
    });
  };

  // join conversation and meeting can be joined from there
  const joinConversation = () => {
    let conversationId = joinId;
    conversationId = conversationId.slice(conversationId.lastIndexOf("/") + 1);
    if (conversationId.length === 8) {
      history.push(`/conversation/${conversationId}`);
    } else {
      M.toast({
        html: "Invalid conversation link",
        classes: "#c62828 red darken-3",
      });
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div className="start-meeting">
        <div className="row">
          <div className="col l6 m12 s12">
            <div className="video">
              <video
                className="responsive-video z-depth-2"
                ref={preview}
                muted={true}
                id="preview"
              />
              <div className="video-ctrl">
                <button
                  className="btn-floating red"
                  id="videocam"
                  onClick={toggleVideo}
                >
                  <i className="material-icons">{videoStatus}</i>
                </button>
                <button
                  className="btn-floating red"
                  id="mic"
                  onClick={toggleAudio}
                >
                  <i className="material-icons">{audioStatus}</i>
                </button>
              </div>
            </div>
          </div>
          <div className="col l6 m12 s12">
            <div className="row">
              <div className="col s12">
                <ul className="tabs">
                  <li className="tab col s6">
                    <Link className="active" to="#new">
                      New
                    </Link>
                  </li>
                  <li className="tab col s6">
                    <Link className="" to="#join">
                      Join
                    </Link>
                  </li>
                </ul>
                <div id="new" className="col s12 meet-option">
                  <InputField
                    type="text"
                    label="Conversation/Meet Name"
                    changer={setName}
                  />
                  <div className="col s12">
                    <button
                      className="btn"
                      onClick={newMeeting}
                      style={{ marginRight: "10px" }}
                    >
                      Start New Meeting
                    </button>
                    <button className="btn" onClick={newConversation}>
                      Start New Conversation
                    </button>
                  </div>
                </div>
                <div id="join" className="col s12 meet-option">
                  <InputField
                    type="text"
                    label="Meeting Link"
                    changer={setJoinId}
                  />
                  <div>
                    <button className="btn" onClick={joinMeeting}>
                      Join Meeting
                    </button>
                  </div>
                  <InputField
                    type="text"
                    label="Conversation Link"
                    changer={setJoinId}
                  />
                  <div>
                    <button className="btn" onClick={joinConversation}>
                      Join Conversation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
