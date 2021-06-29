import React, { useEffect, useRef } from "react";

export default function Video({ srcObject, muted }) {
  const ref = useRef();
  useEffect(() => {
    ref.current.srcObject = srcObject;
  }, [srcObject]);
  return (
    <video
      className="responsive-video z-depth-3"
      ref={ref}
      muted={muted}
      onLoadedMetadata={() => ref.current.play()}
    />
  );
}
