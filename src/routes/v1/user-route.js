const express = require("express");

const { UserController } = require("../../controllers");

const router = express.Router();

// POST : /api/v1/user/signup/
router.post("/signup", UserController.signup);

// POST : /api/v1/user/signin/
router.post("/signin", UserController.signin);

module.exports = router;