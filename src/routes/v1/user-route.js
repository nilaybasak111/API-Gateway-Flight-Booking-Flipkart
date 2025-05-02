const express = require("express");

const { UserController } = require("../../controllers");

const router = express.Router();

// POST : /api/v1/signup/
router.post("/", UserController.signup);

module.exports = router;