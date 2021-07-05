import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./StartMeeting.css";
import { Link, useHistory } from "react-router-dom";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setStreamState } from "../../redux/actions/streamActions";
import M from "materialize-css";
import config from "../../config/keys";

export const socket = io(config.URL);

export default function StartMeetingScreen() {
  const user = useSelector((state) => state.userReducer);
  const [stream, setStream] = useState(null);
  const [videoStatus, setVideoStatus] = useState("videocam");
  const [audioStatus, setAudioStatus] = useState("mic");
  const [joinId, setJoinId] = useState("");
  const [loader, setLoader] = useState(true);
  const preview = useRef();
  const history = useHistory();
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
          history.replace("/login");
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

  // cleanup think
  useEffect(() => {
    return () => {
      // if (!streamState) history.go(0);
    };
  }, []);

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

  const newMeeting = () => {
    const streamState = {
      videoStatus,
      audioStatus,
    };
    dispatch(setStreamState(streamState));
    socket.emit("newMeeting");
    socket.on("newMeeting", (data) => {
      history.push(`/meet/${data.meetId}`);
      M.toast({
        html: `Meet link: ${config.URL}meet/${data.meetId}`,
      });
    });
  };

  const joinMeeting = () => {
    let meetId = joinId;
    meetId = meetId.slice(meetId.lastIndexOf("/") + 1);
    if (meetId.length == 8) {
      const streamState = {
        videoStatus,
        audioStatus,
      };
      dispatch(setStreamState(streamState));
      console.log(meetId);
      socket.emit("joinMeeting", { user, meetId });
      history.push(`/meet/${meetId}`);
    } else {
      M.toast({ html: "Invalid meet link", classes: "#c62828 red darken-3" });
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
                    <Link className="active" to="#newMeet">
                      New Meeting
                    </Link>
                  </li>
                  <li className="tab col s6">
                    <Link className="" to="#joinMeet">
                      Join Meeting
                    </Link>
                  </li>
                </ul>
                <div id="newMeet" className="col s12 meet-option">
                  <h5>Host a new meeting</h5>
                  <button className="btn" onClick={newMeeting}>
                    Start New Meeting
                  </button>
                </div>
                <div id="joinMeet" className="col s12 meet-option">
                  <h5>Join a meeting</h5>
                  <InputField
                    type="text"
                    label="Meeting Link"
                    changer={setJoinId}
                  />
                  <button className="btn" onClick={joinMeeting}>
                    Join Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
