const { StatusCodes } = require("http-status-codes");

const { UserRepository, RoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth, Enums } = require("../utils/common");

const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

async function createUser(data) {
  try {
    const user = await userRepo.create(data);
    const role = await roleRepo.getRoleByName(Enums.USER_ROLES.CUSTOMER);
    console.log("this is role ",role);
    user.addRole(role);
    return user;
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      console.log(explanation);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot Create A New User Object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signin(data) {
  try {
    const user = await userRepo.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "User Not Found for the Given Email",
        StatusCodes.NOT_FOUND
      );
    }

    const isPasswordCorrect = Auth.checkPassword(data.password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Password is Incorrect", StatusCodes.BAD_REQUEST);
    }
    const jwt = Auth.createToken({ id: user.id, email: user.email });
    return jwt;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.log(error);
    throw new AppError(
      "Something Went Wrong While Signing In",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Token Not Found", StatusCodes.BAD_REQUEST);
    }

    const response = Auth.verifyToken(token);
    const user = await userRepo.get(response.id);

    // This '!user' condition usually can't be triggered because if the token is valid, the user will already exist in the database.
    // But in Real World, if the user is deleted from the database then this can trigger
    // So we need to check if the user is there in the database or not for Security Purpose
    if (!user) {
      throw new AppError("User Not Found", StatusCodes.NOT_FOUND);
    }
    return user.id;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error.name == "JsonWebTokenError") {
      throw new AppError("Invalid JWT Token", StatusCodes.BAD_REQUEST);
    }
    if (error.name == "TokenExpiredError") {
      throw new AppError("JWT Token Expired", StatusCodes.UNAUTHORIZED);
    }
    console.log(error);
    throw new AppError(
      "Something Went Wrong While Authenticating User",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { createUser, signin, isAuthenticated };
