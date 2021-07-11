import { combineReducers } from "redux";
import userReducer from "./userReducer";
import streamReducer from "./streamReducer";

// rootReducer wrapper of all reducers
const rootReducer = combineReducers({
  userReducer,
  streamReducer,
});

export default rootReducer;
