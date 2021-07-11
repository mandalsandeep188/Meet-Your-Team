import React, { useEffect } from "react";
import M from "materialize-css";

// Modal component wich receive it's content as props.children

export default function Modal(props) {
  useEffect(() => {
    M.AutoInit();
  }, []);
  return (
    <div
      id={props.id}
      className={`modal modal-fixed-footer ${props.modalClass}`}
    >
      <div className="modal-content">{props.children}</div>
      <div className="modal-footer">
        <button className="modal-close btn-flat">Close</button>
      </div>
    </div>
  );
}
