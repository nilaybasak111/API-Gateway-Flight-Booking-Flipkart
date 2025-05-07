const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

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

async function checkAuth(req, res, next) {
  try{
    const response = await UserService.isAuthenticated(req.headers['x-access-token']);
    if(response){
      res.user = response; // Setting the User Id in the Response Object
      next();
    }
  } catch(error){
    return res.status(error.statusCode).json(error);
  }
}

module.exports = {
  validateAuthRequest,
  checkAuth,
};