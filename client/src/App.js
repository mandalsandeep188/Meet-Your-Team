import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import firebase from "./utils/firebase";
import Routing from "./components/Routing";
import "firebase/analytics";
firebase.analytics();

// App gateway
function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
