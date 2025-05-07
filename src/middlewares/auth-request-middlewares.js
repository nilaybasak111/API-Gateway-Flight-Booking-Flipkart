const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message = "Something Went Wrong While Authenticating A User";
    ErrorResponse.error = new AppError(
      ["Email is not found in this format --> email"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.password) {
    ErrorResponse.message = "Something Went Wrong While Authenticating A User";
    ErrorResponse.error = new AppError(
      ["Password is not found in this format --> password"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  
  next();
}

module.exports = {
  validateAuthRequest,
};