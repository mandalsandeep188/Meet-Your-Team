import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import LoginScreen from "../screens/Login/LoginScreen";
import Navbar from "../components/Navbar/Navbar";
import HomeScreen from "../screens/Home/HomeScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import { useDispatch } from "react-redux";
import StartMeetingScreen from "../screens/StartMeeting/StartMeetingScreen";
import MeetingScreen from "../screens/Meeting/MeetingScreen";
import ConversationScreen from "../screens/Conversation/ConversationScreen";
import { loginUser } from "../redux/actions/userActions";

// Web app routing

export default function Routing() {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(loginUser(user));
    }
  }, []);
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
        <Navbar />
        <StartMeetingScreen />
      </Route>
      <Route path="/meet/:meetId">
        <MeetingScreen />
      </Route>
      <Route path="/conversation/:id">
        <ConversationScreen />
      </Route>
      <Route path="/conversations">
        <ConversationScreen />
      </Route>
      <Route path="/">
        <Navbar />
        <HomeScreen />
      </Route>
    </Switch>
  );
}
