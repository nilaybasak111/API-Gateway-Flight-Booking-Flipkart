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
  try {
    const bearerHeader = req.headers["x-access-token"];
    if (!bearerHeader) {
      throw new AppError(
        "Token Not Found, Please Send The Correct Token",
        StatusCodes.BAD_REQUEST
      );
    }

    // Here We Split Bearer and Token
    const token = bearerHeader.split(" ")[1];
    const response = await UserService.isAuthenticated(token);
    if (response) {
      req.user = response; // Setting the User Id in the Response Object
      next();
    }
  } catch (error) {
    console.log("This is error in auth-request-middlewares.checkAuth ", error);
    return res.status(error.statusCode).json(error);
  }
}

async function isAdmin(req, res, next) {
  try {
    const response = await UserService.isAdmin(req.user);
    if (!response) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "You Are Not Authorized For Access This Action",
      });
    }

    next();
  } catch (error) {
    console.log("This is error in auth-request-middlewares.checkAuth ", error);
    return res.status(error.statusCode).json(error);
  }
}

module.exports = {
  validateAuthRequest,
  checkAuth,
  isAdmin,
};
