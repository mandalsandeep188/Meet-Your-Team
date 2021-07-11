import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";
import { loginUser } from "../../redux/actions/userActions";
import M from "materialize-css";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";
import "./Auth.css";

export default function LoginScreen() {
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  // login user
  const login = (e) => {
    e.preventDefault();
    setLoader(true);
    fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(loginUser(data.user));
          M.toast({ html: data.message, classes: "#43a047 green darken-1" });

          // cheching from where login page is directed to go there after login
          const search = location.search;
          const from = search.length
            ? location.search.slice(search.indexOf("/"))
            : "/";
          history.replace(from);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // show or hide password
  const togglePassword = () => {
    if (showPassword === "password") setShowPassword("text");
    else setShowPassword("password");
  };

  return (
    <>
      {loader && <Loader />}
      <div className="container card auth" style={{ marginTop: "90px" }}>
        <div className="row">
          <h4 className="col s12">
            Login to <span>Meet Your Team</span>
          </h4>
          <form className="col s12" onSubmit={(e) => login(e)}>
            <div className="row">
              <InputField type={"email"} label={"Email"} changer={setEmail} />
              <InputField
                type={showPassword}
                label={"Password"}
                changer={setPasword}
              >
                <button
                  className="btn-floating transparent icon-btn"
                  type="button"
                  onClick={togglePassword}
                >
                  <i className="material-icons black-text">
                    {showPassword === "password"
                      ? "visibility_off"
                      : "visibility"}
                  </i>
                </button>
              </InputField>
              <div className="col s3">
                <button className="btn" type="submit">
                  Login
                </button>
              </div>
              <div className="col m8 s12 link">
                <Link to={`/register${location.search}`}>
                  Create a new account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
