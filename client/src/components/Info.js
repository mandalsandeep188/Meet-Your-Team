import React from "react";
import Modal from "./Modal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import config from "../config/keys";
import M from "materialize-css";

// Meeting/conversation info

export default function Info({ conversation, screen }) {
  return (
    <Modal id="info">
      <div className="row">
        <Link to="/" className="brand-logo col m6 s12 row logo left">
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            className="responsive-img col s4"
            alt="Meet Your Team"
          />
          <h5 className="col s8">Meet Your Team</h5>
        </Link>
        <h5 className="col s12">{screen} Info</h5>
        <h6 className="col s12">
          <b>Name :</b> {conversation.name}
        </h6>
        <h6 className="col s12 m4">
          <b>Meet link : </b>
        </h6>
        <h6 className="col s9 m6">
          {config.CLIENT}/meet/{conversation.conversationId}
        </h6>
        <div className="col m2 s3">
          <CopyToClipboard
            text={`${config.CLIENT}/meet/${conversation.conversationId}`}
            onCopy={() => M.toast({ html: "Copied to clipboard" })}
          >
            <button className="btn-flat gray">
              <i className="material-icons black-text">content_copy</i>
            </button>
          </CopyToClipboard>
        </div>
        <h6 className="col s12 m4">
          <b>Conversation link : </b>
        </h6>
        <h6 className="col s9 m6">
          {config.CLIENT}/conversation/{conversation.conversationId}
        </h6>
        <div className="col m2 s3">
          <CopyToClipboard
            text={`${config.CLIENT}/conversation/${conversation.conversationId}`}
            onCopy={() => M.toast({ html: "Copied to clipboard" })}
          >
            <button className="btn-flat gray">
              <i className=" material-icons black-text">content_copy</i>
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </Modal>
  );
}
