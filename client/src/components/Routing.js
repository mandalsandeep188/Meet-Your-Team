import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginScreen from "../screens/Login/LoginScreen";
import Navbar from "../components/Navbar/Navbar";
import HomeScreen from "../screens/Home/HomeScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";

export default function Routing() {
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
      <Route path="/">
        <Navbar />
        <HomeScreen />
      </Route>
    </Switch>
  );
}
