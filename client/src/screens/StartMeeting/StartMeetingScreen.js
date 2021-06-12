import React, { useEffect, useRef } from "react";
import "./StartMeeting.css";

export default function StartMeetingScreen() {
  const preview = useRef();

  useEffect(() => {
    const myVideo = preview.current;
    myVideo.muted = true;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);
      });

    return () => {
      console.log("left start meeting");
    };
  }, []);

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  };

  return (
    <div className="start-meeting">
      <div className="row">
        <div className="col m8 s12">
          <video className="responsive-video" ref={preview}></video>
        </div>
      </div>
    </div>
  );
}
