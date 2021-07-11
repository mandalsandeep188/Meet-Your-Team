import React from "react";

// Pre loader component

export default function Loader() {
  return (
    <div className="preloader-wrapper big active">
      <div className="spinner-layer spinner-teal-only">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div>
        <div className="gap-patch">
          <div className="circle"></div>
        </div>
        <div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  );
}
