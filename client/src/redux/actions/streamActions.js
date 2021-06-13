export const setStream = (stream) => {
  return {
    type: "SET_STREAM",
    payload: stream,
  };
};

export const stopStream = (stream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
  return {
    type: "STOP_STREAM",
    payload: stream,
  };
};
