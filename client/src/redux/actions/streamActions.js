// stream state like video/audio on/off action
export const setStreamState = (streamState) => {
  return {
    type: "SET_STREAM",
    payload: streamState,
  };
};
