import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ boxShadow: "none" }} className="transparent">
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo center">
          Meet Your Team
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <Link to="/login" className="btn">
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="btn-flat green-text"
              style={{ border: "1px solid green" }}
            >
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
