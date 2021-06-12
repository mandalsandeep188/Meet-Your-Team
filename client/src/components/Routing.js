import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LoginScreen from "../screens/Login/LoginScreen";
import Navbar from "../components/Navbar/Navbar";
import HomeScreen from "../screens/Home/HomeScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import { useSelector } from "react-redux";
import StartMeetingScreen from "../screens/StartMeeting/StartMeetingScreen";

export default function Routing() {
  // direct startMeeting problem
  const user = useSelector((state) => state.userReducer);
  return (
    <Switch>
      <Route path="/login">
        <Navbar />
        <LoginScreen />
      </Route>
      <Route path="/register">
        <Navbar />
        <RegisterScreen />
      </Route>
      <Route path="/startMeeting">
        {user ? (
          <>
            <Navbar />
            <StartMeetingScreen />
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/">
        <Navbar />
        <HomeScreen />
      </Route>
    </Switch>
  );
}
