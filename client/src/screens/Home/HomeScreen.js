import React from "react";
import "./HomeScreen.css";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
    <div>
      <div className="row welcome">
        <div className="col s12 m12 l7">
          <h3>
            Welcome to <span>Meet Your Team</span>
          </h3>
          <p>
            Grow and learn with your team here! <br />
            Reach your team of work or school across the world <br />
            to interact with them in a easy and effective way.
          </p>
          <Link className="btn" to="/startMeeting" style={{ margin: "10px 0" }}>
            Start Meeting
          </Link>
          <Link
            className="btn green"
            style={{ margin: "10px 0" }}
            to="/conversations"
          >
            Conversations
          </Link>
        </div>
        <div className="col s12 m12 l5">
          <img className="responsive-img" src="meeting.jpg" alt="meeting" />
        </div>
        <div className="people hide-on-med-and-down">
          <img src="people.png" alt="people" className="responsive-img" />
        </div>
      </div>
    </div>
  );
}
