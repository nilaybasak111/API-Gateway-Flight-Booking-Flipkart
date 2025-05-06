const { StatusCodes } = require("http-status-codes");

const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth } = require("../utils/common");

const userRepo = new UserRepository();

async function createUser(data) {
  try {
    const user = await userRepo.create(data);
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

module.exports = { createUser, signin };
