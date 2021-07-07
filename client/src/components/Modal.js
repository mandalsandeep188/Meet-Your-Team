import React, { useEffect } from "react";
import M from "materialize-css";

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
        <button className="modal-close waves-effect waves-green btn-flat">
          Close
        </button>
      </div>
    </div>
  );
}
