const express = require("express");

const { UserController } = require("../../controllers");
const { AuthRequestMiddlewares } = require("../../middlewares");

const router = express.Router();

// POST : /api/v1/user/signup/
router.post(
  "/signup",
  AuthRequestMiddlewares.validateAuthRequest,
  UserController.signup
);

// POST : /api/v1/user/signin/
router.post(
  "/signin",
  AuthRequestMiddlewares.validateAuthRequest,
  UserController.signin
);

// GET : /api/v1/user/:id
router.get("/:id", UserController.getUserMailById);

// POST : /api/v1/user/role/
router.post(
  "/role",
  AuthRequestMiddlewares.checkAuth,
  AuthRequestMiddlewares.isAdmin,
  UserController.addRoleToUser
);

module.exports = router;
