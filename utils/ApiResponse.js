sendSuccess = (res, message = "Success", data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

sendError = (res, message = "Something went wrong", statusCode = 500, errors = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
module.exports={sendError,sendSuccess}