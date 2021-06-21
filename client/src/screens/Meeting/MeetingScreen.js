import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import "./Meeting.css";
import { socket } from "../StartMeeting/StartMeetingScreen";
import { loginUser } from "../../redux/actions/userActions";

export default function MeetingScreen() {
  const streamState = useSelector((state) => state.streamReducer);
  const user = useSelector((state) => state.userReducer);
  const { meetId } = useParams();
  const [stream, setStream] = useState(null);
  const [sendingStream, setSendingStream] = useState([]);
  const [peer, setPeer] = useState();
  const [videoStatus, setVideoStatus] = useState(
    streamState ? streamState.videoStatus : "videocam"
  );
  const [audioStatus, setAudioStatus] = useState(
    streamState ? streamState.audioStatus : "mic"
  );
  const peers = useRef({});
  const [peopleCount, setPeopleCount] = useState(0);
  const count = useRef(0);
  const history = useHistory();
  const grid = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // Authenticate user
    fetch(`/meeting/${meetId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          history.replace("/");
        } else {
          dispatch(loginUser(user));
          startStream();
        }
      });

    // peer disconnect on leave
    return () => {
      history.go(0);
    };
  }, []);

  useEffect(() => {
    // Set peer by user id
    let user = JSON.parse(localStorage.getItem("user"));
    if (!peer && user) {
      setPeer(
        new Peer(user._id, {
          host: "/",
          path: "/peer",
          port: 5000,
        })
      );
    }

    // Events
    if (peer) {
      // peer open event
      peer.on("open", (id) => {
        console.log("hello", id);
        socket.emit("joinMeeting", { id, meetId, user });
      });

      peer.on("error", (err) => console.log(err));

      // on call
      peer.on("call", (call) => {
        recieveCall(call);
      });

      // user connected
      socket.on("user-connected", (data) => {
        if (data.error) {
          M.toast({ html: data.error });
        } else {
          console.log("connected user", data.userId);
          M.toast({ html: `${data.user.name} joined the meeting` });
          callUser(user._id, data.userId);
        }
      });

      socket.on("user-disconnected", (userId, user) => {
        console.log("socket disconnected", user.name);
        if (userId) {
          M.toast({ html: `${user.name} left the meeting` });
          if (peers.current[userId]) {
            peers.current[userId].remove();
            setPeopleCount(count.current - 1);
            count.current = count.current - 1;
          }
        }
      });
    }
  }, [peer]);

  // start self stream
  const startStream = () => {
    const video = document.createElement("video");
    video.muted = true;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        stream.getAudioTracks()[0].enabled = audioStatus === "mic";
        stream.getVideoTracks()[0].enabled = videoStatus === "videocam";
        setStream(stream);
        addVideoStream(video, stream);
      });
  };

  // call new user
  const callUser = (myId, userId) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        stream.getAudioTracks()[0].enabled = audioStatus === "mic";
        stream.getVideoTracks()[0].enabled = videoStatus === "videocam";
        setSendingStream([...sendingStream, stream]);
        console.log("calling...", userId);
        const call = peer.call(userId, stream, { metadata: { userId: myId } });
        const video = document.createElement("video");
        peers.current[userId] = video;
        call.on("stream", (userVideoStream) => {
          console.log("Getting reciever stream...");
          addVideoStream(video, userVideoStream);
        });
        call.on("close", () => {
          console.log("call closed");
          video.remove();
        });
      });
  };

  // recieve call
  const recieveCall = (call) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        stream.getAudioTracks()[0].enabled = audioStatus === "mic";
        stream.getVideoTracks()[0].enabled = videoStatus === "videocam";
        setSendingStream([...sendingStream, stream]);
        console.log("Answering call...");
        call.answer(stream);
        const video = document.createElement("video");
        peers.current[call.metadata.userId] = video;
        call.on("stream", (userVideoStream) => {
          console.log("Getting caller's stream....");
          addVideoStream(video, userVideoStream);
        });
      });
  };

  // add video stream to UI
  const addVideoStream = (video, stream) => {
    video.classList.add(["responsive-video", "z-depth-3"]);
    if (!video.srcObject) {
      setPeopleCount(count.current + 1);
      count.current = count.current + 1;
    }
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    grid.current.append(video);
  };

  // video controls
  const toggleVideo = () => {
    if (videoStatus === "videocam") {
      setVideoStatus("videocam_off");
      stream.getVideoTracks()[0].enabled = false;
      sendingStream.forEach((stream) => {
        stream.getVideoTracks()[0].enabled = false;
      });
    } else {
      setVideoStatus("videocam");
      stream.getVideoTracks()[0].enabled = true;
      sendingStream.forEach((stream) => {
        stream.getVideoTracks()[0].enabled = true;
      });
    }
  };

  const toggleAudio = () => {
    if (audioStatus === "mic") {
      setAudioStatus("mic_off");
      stream.getAudioTracks()[0].enabled = false;
      sendingStream.forEach((stream) => {
        stream.getAudioTracks()[0].enabled = false;
      });
    } else {
      setAudioStatus("mic");
      stream.getAudioTracks()[0].enabled = true;
      sendingStream.forEach((stream) => {
        stream.getAudioTracks()[0].enabled = true;
      });
    }
  };

  return (
    <>
      <div
        className="video-grid"
        ref={grid}
        style={{
          gridTemplateColumns: `repeat(${Math.min(3, peopleCount)},1fr)`,
          gridTemplateRows: `repeat(${Math.ceil(peopleCount / 3)},1fr)`,
        }}
      ></div>
      <div className="video-controls">
        <button className="btn-floating btn red" onClick={toggleVideo}>
          <i className="material-icons">{videoStatus}</i>
        </button>
        <button
          className="btn-floating btn red"
          onClick={() => {
            history.replace("/");
          }}
        >
          <i className="material-icons">call_end</i>
        </button>
        <button className="btn-floating btn red" onClick={toggleAudio}>
          <i className="material-icons">{audioStatus}</i>
        </button>
      </div>
    </>
  );
}
