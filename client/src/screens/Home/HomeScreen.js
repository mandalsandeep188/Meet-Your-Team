import React from "react";
import "./HomeScreen.css";

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
          <button className="btn" style={{ marginTop: "10px" }}>
            Start Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
