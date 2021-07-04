import React from "react";
import { useSelector } from "react-redux";
import "./HomeScreen.css";
import M from "materialize-css";
import { useHistory } from "react-router";

export default function HomeScreen() {
  const user = useSelector((state) => state.userReducer);
  const history = useHistory();
  const startMeet = () => {
    if (user) {
      history.push("/startMeeting");
    } else {
      M.toast({
        html: "You must be logged in!",
        classes: "#c62828 red darken-3",
      });
      history.push("/login");
    }
  };
  return (
    <div>
      <div className="row welcome">
        <div className="col s12 m12 l7" style={{ paddingTop: "15px" }}>
          <h3>
            Welcome to <span>Meet Your Team</span>
          </h3>
          <p>
            Grow and learn with your team here! <br />
            Reach your team of work or school across the world <br />
            to interact with them in a easy and effective way.
          </p>
          <button
            className="btn"
            style={{ margin: "10px 0" }}
            onClick={startMeet}
          >
            Start Meeting
          </button>
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
