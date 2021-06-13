import { combineReducers } from "redux";
import userReducer from "./userReducer";
import streamReducer from "./streamReducer";

const rootReducer = combineReducers({
  userReducer,
  streamReducer,
});

export default rootReducer;
