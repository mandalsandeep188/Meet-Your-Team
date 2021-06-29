import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routing from "./components/Routing";
import firebaseConfig from "./constants/firebase";

function App() {
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
