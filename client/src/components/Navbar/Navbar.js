import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import "./Navbar.css";
import M from "materialize-css";

export default function Navbar() {
  const user = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    M.toast({
      html: "Logged out successfully",
      classes: "#c62828 red darken-3",
    });
  };

  return (
    <nav style={{ boxShadow: "none" }} className="transparent">
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo center">
          <img
            src={"logo.png"}
            className="responsive-img logo"
            alt="Meet Your Team"
          />
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {!user ? (
            <>
              <li>
                <Link to="/login" className="btn">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn green">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  className="btn red"
                  onClick={logout}
                  style={{ marginRight: "20px" }}
                >
                  Log out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
