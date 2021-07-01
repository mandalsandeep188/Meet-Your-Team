import React, { useEffect, useRef } from "react";

export default function Video({ srcObject, muted, name }) {
  const ref = useRef();
  useEffect(() => {
    ref.current.srcObject = srcObject;
  }, [srcObject]);
  return (
    <div className="video">
      <video
        className="responsive-video"
        ref={ref}
        muted={muted}
        onLoadedMetadata={() => ref.current.play()}
      />
      <div className="user-name">
        <h6>{name}</h6>
      </div>
    </div>
  );
}
