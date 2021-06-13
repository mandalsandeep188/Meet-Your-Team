import React, { useEffect, useRef, useState } from "react";
import "./StartMeeting.css";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import InputField from "../../components/InputField";

export default function StartMeetingScreen() {
  const preview = useRef();
  const [stream, setStream] = useState(null);
  const history = useHistory();

  const [videoStatus, setVideoStatus] = useState("videocam");
  const [audioStatus, setAudioStatus] = useState("mic");

  useEffect(() => {
    // getting video stream
    startStream(true, true);
    M.AutoInit();
  }, []);

  const startStream = (video, audio) => {
    const myVideo = preview.current;
    navigator.mediaDevices
      .getUserMedia({
        video,
        audio,
      })
      .then((stream) => {
        window.localStream = stream;
        addVideoStream(myVideo, stream);
      });
  };

  // Initialize video preview
  const addVideoStream = (video, stream) => {
    setStream(stream);
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  };

  const toggleVideo = () => {
    if (videoStatus === "videocam") {
      setVideoStatus("videocam_off");
      stream.getTracks().forEach((track) => {
        if (track.kind === "video" && track.readyState === "live") {
          track.stop();
        }
      });
    } else {
      startStream(true, audioStatus === "mic");
      setVideoStatus("videocam");
    }
  };

  const toggleAudio = () => {
    if (audioStatus === "mic") {
      setAudioStatus("mic_off");
      stream.getTracks().forEach((track) => {
        if (track.kind === "audio" && track.readyState === "live") {
          track.stop();
        }
      });
    } else {
      startStream(videoStatus === "videocam", true);
      setAudioStatus("mic");
    }
  };

  // cleanup
  useEffect(() => {
    return () => {
      console.log("left start meeting");
      history.go(0);
    };
  }, []);

  return (
    <div className="start-meeting">
      <div className="row">
        <div className="col m6 s12">
          <div className="video">
            <video
              className="responsive-video"
              ref={preview}
              muted={true}
              id="preview"
            />
            <button
              className="btn-floating btn-large red"
              id="videocam"
              onClick={toggleVideo}
            >
              <i className="material-icons">{videoStatus}</i>
            </button>
            <button
              className="btn-floating btn-large red"
              id="mic"
              onClick={toggleAudio}
            >
              <i className="material-icons">{audioStatus}</i>
            </button>
          </div>
        </div>
        <div className="col m6 s12">
          <div class="row">
            <div class="col s12">
              <ul class="tabs">
                <li class="tab col s6">
                  <Link className="active" to="#newMeet">
                    New Meeting
                  </Link>
                </li>
                <li class="tab col s6">
                  <Link class="" to="#joinMeet">
                    Join Meeting
                  </Link>
                </li>
              </ul>
              <div id="newMeet" class="col s12 meet-option">
                <h4>Host a new meeting</h4>
                <button className="btn">Start New Meeting</button>
              </div>
              <div id="joinMeet" class="col s12 meet-option">
                <h4>Join a meeting</h4>
                <InputField type="text" label="Meeting Link" />
                <button className="btn">Join Meeting</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
