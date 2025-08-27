const drawNotify = (code, message) => {
  sessionStorage.setItem(
    "notify",
    JSON.stringify({
      code: code,
      message: message,
    })
  );
};

export default drawNotify;
