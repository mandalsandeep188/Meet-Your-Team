import React from "react";
import "./HomeScreen.css";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
    <div>
      <div className="row welcome">
        <div className="col s12 m7">
          <h3>Welcome to Meet Your Team</h3>
          <p>
            Reach your team across the world to interact with them in a easy and
            effective way.
          </p>
          <Link
            to="/startMeeting"
            className="btn"
            style={{ marginTop: "10px" }}
          >
            Start Meeting
          </Link>
        </div>
      </div>
    </div>
  );
}
