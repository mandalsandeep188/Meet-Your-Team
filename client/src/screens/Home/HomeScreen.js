import React from "react";
import "./HomeScreen.css";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
    <div>
      <div className="row welcome">
        <div className="col s12 m12 l7" style={{ paddingTop: "15px" }}>
          <h3>
            Welcome to <br />
            Meet Your Team
          </h3>
          <p>
            Grow and learn with your team here! <br />
            Reach your team of work or school across the world to interact with
            them in a easy and effective way.
          </p>
          <Link to="/startMeeting" className="btn" style={{ margin: "10px 0" }}>
            Start Meeting
          </Link>
        </div>
        <div className="col s12 m12 l5">
          <img className="responsive-img" src="meeting.jpg" alt="meeting" />
        </div>
      </div>
    </div>
  );
}
