// stream state reducer

const initialState = null;

export default function streamReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_STREAM":
      return action.payload;

    default:
      return state;
  }
}
