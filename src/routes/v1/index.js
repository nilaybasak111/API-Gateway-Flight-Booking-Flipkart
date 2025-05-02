const express = require("express");

const { InfoController } = require("../../controllers");

const UserRoute = require("./user-route");

const router = express.Router();

router.use("/signup", UserRoute); // POST : /api/v1/signup/

// GET : /api/v1/info
router.get("/info", InfoController.info);

module.exports = router;