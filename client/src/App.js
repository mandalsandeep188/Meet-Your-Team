import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routing from "./components/Routing";
import { useDispatch } from "react-redux";
import { loginUser } from "./redux/actions/userActions";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(loginUser(user));
    }
  }, []);
  return (
    <>
      <div className="bg"></div>
      <div className="App">
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
