import React, { useEffect, useRef } from "react";

// Video component receiveing srcObject

export default function Video(props) {
  const ref = useRef();
  useEffect(() => {
    ref.current.srcObject = props.srcObject;
  }, [props.srcObject]);
  return (
    <div
      className="video"
      style={{ height: `${props.fullHeight ? "86vh" : ""}` }}
    >
      <video
        className="responsive-video"
        ref={ref}
        muted={props.muted}
        onLoadedMetadata={() => {
          ref.current.play();
          props.loader(false);
        }}
      />
      <div className="user">
        <img
          className="responsive-img circle"
          src={props.user.profileImage}
          alt={props.user.name}
        />
        <h6>{props.user.name}</h6>
      </div>
    </div>
  );
}
