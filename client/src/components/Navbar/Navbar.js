import React, { useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import "./Navbar.css";
import M from "materialize-css";

export default function Navbar() {
  const user = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // user logout
  const logout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    M.toast({
      html: "Logged out successfully",
      classes: "#c62828 red darken-3",
    });
    history.replace("/");
  };

  // css library init
  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <nav style={{ boxShadow: "none", padding: "10px" }} className="transparent">
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo row logo left">
          <img
            src={"logo.png"}
            className="responsive-img col s4"
            alt="Meet Your Team"
          />
          <h6 className="col s8">Meet Your Team</h6>
        </Link>

        {/* To show in pc */}
        <ul id="nav-mobile" className="right hide-on-small-and-down">
          {!user ? (
            <>
              <li>
                <Link to={`/login${location.search}`} className="btn">
                  Login
                </Link>
              </li>
              <li>
                <Link to={`/register${location.search}`} className="btn green">
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

        {/* To show in mobile */}
        <button
          className="btn-flat dropdown-trigger hide-on-med-and-up right"
          data-target="dropdown"
        >
          <i className="material-icons teal-text">menu</i>
        </button>
        <ul id="dropdown" className="dropdown-content hide-on-med-and-up">
          {!user ? (
            <>
              <li>
                <Link to={`/login${location.search}`}>Login</Link>
              </li>
              <li>
                <Link to={`/register${location.search}`}>Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="#" onClick={logout}>
                  Log out
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
