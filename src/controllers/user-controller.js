const { StatusCodes } = require("http-status-codes");

const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/*
 * POST : /api/v1/user/signup/
 * req.body = { email : "nilaybasak@gmail.com", password : "12345678" }
 */
async function signup(req, res) {
  try {
    const user = await UserService.createUser({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

/*
 * POST : /api/v1/user/sigin/
 * req.body = { email : "nilaybasak@gmail.com", password : "12345678" }
 */
async function signin(req, res) {
  try {
    const user = await UserService.signin({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

/*
 * POST : /api/v1/user/role/
 * req.body = { id : "1", role : "admin" }
 * Only Admin Can Add Role To A User.
 * So Here id is the User Id of the New User and 
 * Role is the Role Name which You want to assign to the User.
 */
async function addRoleToUser(req, res) {
  try {
    const user = await UserService.addRoleToUser({
      id: req.body.id,
      role: req.body.role,
    });
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  signup,
  signin,
  addRoleToUser,
};
