const ajaxErrorHandler = error => {
  let message;
  if (error.response) {
    // console.error(error.response);
    message = error.response.data.message;
  } else if (error.request) {
    // console.error(error.request);
    message = "Request timed out, try again";
  } else {
    message = "Unknown error. Try again";
    // console.error(error.message);
  }
  return message;
};

export default ajaxErrorHandler;
