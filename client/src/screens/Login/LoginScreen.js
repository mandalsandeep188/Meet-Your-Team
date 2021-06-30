import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputField from "../../components/InputField";
import { loginUser } from "../../redux/actions/userActions";
import M from "materialize-css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

export default function LoginScreen() {
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const history = useHistory();
  const dispatch = useDispatch();

  const login = (e) => {
    e.preventDefault();
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
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const togglePassword = () => {
    if (showPassword === "password") setShowPassword("text");
    else setShowPassword("password");
  };

  return (
    <div className="container background">
      <div className="row">
        <h4 className="center-align">Login to Meet Your Team</h4>
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
            <div className="col s8 link">
              <Link to="/register">Create a new account</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
