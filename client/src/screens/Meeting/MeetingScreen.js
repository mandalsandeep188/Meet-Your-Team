import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Meeting.css";
import { socket } from "../StartMeeting/StartMeetingScreen";
import Sidebar from "../../components/Sidebar";
import Video from "../../components/Video";
import Loader from "../../components/Loader";
import config from "../../config/keys";

export default function MeetingScreen() {
  const streamState = useSelector((state) => state.streamReducer);
  const user = useRef(JSON.parse(localStorage.getItem("user")));
  const { meetId } = useParams();
  const [stream, setStream] = useState(null);
  const [sendingStream, setSendingStream] = useState([]);
  const [peer, setPeer] = useState();
  const history = useHistory();
  const [videoStatus, setVideoStatus] = useState(
    streamState ? streamState.videoStatus : "videocam_off"
  );
  const [audioStatus, setAudioStatus] = useState(
    streamState ? streamState.audioStatus : "mic_off"
  );
  const [loader, setLoader] = useState(true);

  //storing video stream with users
  // with data structure
  // stream = {
  //   userId : [videoSource,userDetails]
  // }
  const streams = useRef({});
  const [videoSrc, setVideoSrc] = useState({});

  // to store state of meeting from server
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
          history.replace("/login");
        } else if (data.meetError) {
          M.toast({ html: data.meetError, classes: "#c62828 red darken-3" });
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
    if (!peer && user.current) {
      setPeer(
        new Peer(user.current._id, {
          host: "/",
          path: "/peer",
          port: config.PEER_PORT,
        })
      );
    }

    // Events
    if (peer) {
      // peer open event
      peer.on("open", (id) => {
        console.log("hello", id);
        socket.emit("joinMeeting", { id, meetId, user: user.current });
      });

      peer.on("error", (err) => {
        console.log(err);
        history.replace("/");
      });

      // on call
      peer.on("call", (call) => {
        recieveCall(call);
      });

      // user connected
      socket.on("user-connected", (data) => {
        if (!data.error) {
          console.log("connected user", data.userId);
          M.toast({ html: `${data.user.name} joined the meeting` });
          setMeetingUsers(data.meetingUsers);
          callUser(user.current._id, data.userId, user.current, data.user);
        }
      });

      // geting state of meeting joined
      socket.on("joined-meeting", (meetingUsers) => {
        setMeetingUsers(meetingUsers);
        receiveChats();
      });

      // user disconnected
      socket.on("user-disconnected", (userId, user, meetingUsers) => {
        console.log("socket disconnected", user.name);
        setMeetingUsers(meetingUsers);
        if (userId) {
          // removing video of user left
          if (streams.current[userId]) {
            let { [userId]: _, ...videoStreams } = streams.current;
            setVideoSrc(videoStreams);
            streams.current = videoStreams;
          }
          M.toast({ html: `${user.name} left the meeting` });
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
        addVideoStream(stream, "myStream", user.current);
      });
  };

  // call new user
  const callUser = (myId, userId, me, user) => {
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
          metadata: { userId: myId, user: me },
        });
        let id;
        call.on("stream", (userVideoStream) => {
          if (id != userVideoStream.id) {
            console.log("Getting reciever stream...");
            id = userVideoStream.id;
            addVideoStream(userVideoStream, userId, user);
          }
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
        let id;
        call.on("stream", (userVideoStream) => {
          if (id != userVideoStream.id) {
            console.log("Getting caller's stream....");
            id = userVideoStream.id;
            addVideoStream(
              userVideoStream,
              call.metadata.userId,
              call.metadata.user
            );
          }
        });
      });
  };

  // add video stream to UI
  const addVideoStream = (stream, userId, user) => {
    setLoader(true);
    setVideoSrc({ ...streams.current, [userId]: [stream, user] });
    streams.current = { ...streams.current, [userId]: [stream, user] };
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

  const receiveChats = () => {
    fetch("/receiveMessage", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: meetId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMeetingChats(data.chats);
      });
  };

  return (
    <>
      {loader && <Loader />}
      <div className="row meet-screen">
        <div
          className={`col ${
            sideBar === "close" ? "l12" : "l9"
          } m12 s12 scale-transition`}
          style={{ margin: "0px", padding: "0px", position: "relative" }}
        >
          {/* Videos of users in the grid carousel */}
          <Carousel
            autoPlay={false}
            dynamicHeight={true}
            showThumbs={false}
            showIndicators={false}
          >
            {/* Adjusting videos in grid */}
            {[...Array(Math.ceil(Object.entries(videoSrc).length / 2))].map(
              (e, index) => {
                return (
                  <div
                    key={index}
                    className="video-grid"
                    style={{
                      gridTemplateColumns: `repeat(${
                        2 * index + 1 < Object.entries(videoSrc).length
                          ? "2"
                          : "1"
                      }, 1fr)`,
                    }}
                  >
                    <Video
                      srcObject={Object.entries(videoSrc)[2 * index][1][0]}
                      muted={
                        Object.entries(videoSrc)[2 * index][0] === "myStream"
                      }
                      loader={setLoader}
                      user={Object.entries(videoSrc)[2 * index][1][1]}
                      fullHeight={
                        2 * index + 1 === Object.entries(videoSrc).length
                      }
                    />
                    {2 * index + 1 < Object.entries(videoSrc).length && (
                      <Video
                        srcObject={
                          Object.entries(videoSrc)[2 * index + 1][1][0]
                        }
                        user={Object.entries(videoSrc)[2 * index + 1][1][1]}
                        loader={setLoader}
                      />
                    )}
                  </div>
                );
              }
            )}
          </Carousel>

          {/* Video controls */}
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

        {/* To show chats and users */}
        <Sidebar
          toShow={sideBar}
          meetingUsers={meetingUsers}
          meetingChats={meetingChats}
          toggler={setSideBar}
          meetId={meetId}
          receive={setMeetingChats}
        />
      </div>
    </>
  );
}
