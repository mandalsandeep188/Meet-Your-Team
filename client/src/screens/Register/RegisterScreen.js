import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";
import { loginUser } from "../../redux/actions/userActions";
import M from "materialize-css";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";
import firebase from "../../utils/firebase";
import "../Login/Auth.css";
import "firebase/storage";
const storageRef = firebase.storage().ref();

const userDefault =
  "https://firebasestorage.googleapis.com/v0/b/meet-your-team.appspot.com/o/user.jpeg?alt=media&token=7e223194-40f7-4e1f-bb56-9d8d0ec0b5c9";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const [profileImage, setProfileImage] = useState(undefined);
  const [imageText, setImageText] = useState("Upload profile image");
  const [imagePreview, setImagePreview] = useState(userDefault);
  const [imageUrl, setImageUrl] = useState(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // profile imge preview
  useEffect(() => {
    if (profileImage) {
      let reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setImageText("Change profile imgage");
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  // register user
  const registerUser = () => {
    fetch("/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        profileImage: imageUrl,
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
          // cheching from where register page is directed to go there after register
          const search = location.search;
          const from = search.length
            ? location.search.slice(search.indexOf("/"))
            : "/";
          history.replace(from);
        }
        setLoader(false);
      })
      .catch((err) => console.log(err.message));
  };

  // check for profile image and upload to firebase then call registerUser
  const register = (e) => {
    e.preventDefault();
    setLoader(true);
    fetch("/checkEmail", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: "Some error occurred! Try again" });
        } else {
          if (profileImage) {
            const fileName = `users/${email}`;
            storageRef
              .child(fileName)
              .put(profileImage)
              .then(() => {
                storageRef
                  .child(fileName)
                  .getDownloadURL()
                  .then((url) => {
                    setImageUrl(url);
                  })
                  .catch((error) => {
                    console.log(error.code);
                  });
              });
          } else {
            registerUser();
          }
        }
      });
  };

  // when image uplaoded to firebase
  useEffect(() => {
    if (imageUrl) registerUser();
  }, [imageUrl]);

  // show or hide password
  const togglePassword = () => {
    if (showPassword === "password") setShowPassword("text");
    else setShowPassword("password");
  };

  return (
    <>
      {loader && <Loader />}
      <div className="container card auth">
        <div className="row">
          <h4>
            Register with <span>Meet Your Team</span>
          </h4>
          <div className="col s12">
            <img
              className="register-pic responsive-img"
              src={imagePreview}
              alt="Profile pic"
            ></img>
          </div>
          <div className="col s12 center">
            <input
              type="file"
              id="file"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
            <label
              htmlFor="file"
              className="waves-effect btn"
              style={{ marginTop: "0" }}
            >
              {imageText}
            </label>
          </div>
          <form className="col s12" onSubmit={(e) => register(e)}>
            <div className="row">
              <InputField type={"text"} label={"Name"} changer={setName} />
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
                  Register
                </button>
              </div>
              <div className="col m8 s12 link">
                <Link to={`/login${location.search}`}>
                  Already have an account?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
