import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Meeting.css";
import { socket } from "../StartMeeting/StartMeetingScreen";
import Sidebar from "../../components/Sidebar";
import Video from "../../components/Video";

export default function MeetingScreen() {
  const streamState = useSelector((state) => state.streamReducer);
  const { meetId } = useParams();
  const [stream, setStream] = useState(null);
  const [sendingStream, setSendingStream] = useState([]);
  const [peer, setPeer] = useState();
  const peers = useRef({});
  const [peopleCount, setPeopleCount] = useState(0);
  const count = useRef(0);
  const history = useHistory();
  const [videoStatus, setVideoStatus] = useState(
    streamState ? streamState.videoStatus : "videocam"
  );
  const [audioStatus, setAudioStatus] = useState(
    streamState ? streamState.audioStatus : "mic"
  );
  const streams = useRef([]);
  const [videoSrc, setVideoSrc] = useState([]);
  const [meetingUsers, setMeetingUsers] = useState([]);
  const [meetingChats, setMeetingChats] = useState([]);
  const [sideBar, setSideBar] = useState("close");

  useEffect(() => {
    // Authenticate user
    fetch(`/meeting/${meetId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          history.replace("/");
        } else {
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
        console.log("hello", id, user);
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
          setMeetingUsers(data.meetingUsers);
        }
      });

      socket.on("joined-meeting", (meetingUsers, meetingChats) => {
        setMeetingUsers(meetingUsers);
        setMeetingChats(meetingChats);
      });

      // user disconnected
      socket.on("user-disconnected", (userId, user, meetingUsers) => {
        console.log("socket disconnected", user.name);
        setMeetingUsers(meetingUsers);
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
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        stream.getAudioTracks()[0].enabled = audioStatus === "mic";
        stream.getVideoTracks()[0].enabled = videoStatus === "videocam";
        setStream(stream);
        streams.current.push(stream);
        setVideoSrc(streams.current);
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
        const streams = sendingStream;
        streams.push(stream);
        setSendingStream(streams);
        console.log("calling...", userId);
        const call = peer.call(userId, stream, {
          metadata: { userId: myId },
        });
        // look for it------
        const video = document.createElement("video");
        peers.current[userId] = video;
        //-------
        let id;
        call.on("stream", (userVideoStream) => {
          if (id != userVideoStream.id) {
            console.log("Getting reciever stream...");
            id = userVideoStream.id;
            addVideoStream(userVideoStream);
          }
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
        const streams = sendingStream;
        streams.push(stream);
        setSendingStream(streams);
        console.log("Answering call...");
        call.answer(stream);
        // look ---------
        const video = document.createElement("video");
        peers.current[call.metadata.userId] = video;
        // ---------
        let id;
        call.on("stream", (userVideoStream) => {
          if (id != userVideoStream.id) {
            console.log("Getting caller's stream....");
            id = userVideoStream.id;
            addVideoStream(userVideoStream);
          }
        });
      });
  };

  // add video stream to UI
  const addVideoStream = (stream) => {
    console.log("Adding stream", stream.id);
    streams.current.push(stream);
    setVideoSrc(streams.current);
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

  // sidebar controls
  const toggleSideBar = (toShow) => {
    setSideBar(toShow);
    window.scrollTo(0, document.body.scrollHeight);
  };

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    let objDiv = document.getElementsByClassName("chats")[0];
    if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
  }, [sideBar]);

  useEffect(() => {
    console.log("State changed", videoSrc);
  }, [videoSrc]);

  const settings = {
    dots: true,
    infinite: true,
    autoPlay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  //   <Carousel
  //   autoPlay={false}
  //   dynamicHeight={true}
  //   showThumbs={false}
  //   showIndicators={false}
  // >

  return (
    <div className="row meet-screen">
      <div
        className={`col ${
          sideBar === "close" ? "m12" : "m9"
        } s12 scale-transition`}
        style={{ margin: "0px", padding: "0px", position: "relative" }}
      >
        <div className="video-grid">
          <Slider {...settings}>
            {videoSrc.map((srcObject, index) => {
              return (
                <Video srcObject={srcObject} muted={index === 0} key={index} />
              );
            })}
          </Slider>
        </div>
        <div className="video-controls">
          <button className="btn-floating btn red" onClick={toggleVideo}>
            <i className="material-icons">{videoStatus}</i>
          </button>
          <button className="btn-floating btn red" onClick={toggleAudio}>
            <i className="material-icons">{audioStatus}</i>
          </button>
          <button
            className="btn-floating btn red"
            onClick={() => {
              history.replace("/");
            }}
          >
            <i className="material-icons">call_end</i>
          </button>
          <button
            className="btn-floating btn"
            onClick={() => toggleSideBar("users")}
          >
            <i className="material-icons">people</i>
          </button>
          <button
            className="btn-floating btn"
            onClick={() => toggleSideBar("chats")}
          >
            <i className="material-icons">chat</i>
          </button>
        </div>
      </div>
      <Sidebar
        toShow={sideBar}
        meetingUsers={meetingUsers}
        meetingChats={meetingChats}
        toggler={setSideBar}
        meetId={meetId}
        receive={setMeetingChats}
      />
    </div>
  );
}
