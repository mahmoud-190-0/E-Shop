// @desc    this class is responsible about operation errors (errors that i can predict)

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // if start with 4 its a user error other is server
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

  }
}

module.exports = ApiError;
