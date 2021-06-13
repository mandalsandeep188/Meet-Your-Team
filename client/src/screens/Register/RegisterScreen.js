import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputField from "../../components/InputField";
import { loginUser } from "../../redux/actions/userActions";
import M from "materialize-css";
import { useHistory } from "react-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [profileImge, setProfileImge] = useState(undefined);
  const dispatch = useDispatch();
  const history = useHistory();

  const register = (e) => {
    e.preventDefault();
    fetch("/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        profileImge,
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

  return (
    <div className="container background">
      <div class="row">
        <h4 className="center-align">Register with Meet Your Team</h4>
        <form class="col s12" onSubmit={(e) => register(e)}>
          <div className="row">
            <InputField type={"text"} label={"Name"} changer={setName} />
            <InputField type={"email"} label={"Email"} changer={setEmail} />
            <InputField
              type={"password"}
              label={"Password"}
              changer={setPasword}
            />
            <div className="col s3">
              <button className="btn" type="submit">
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
