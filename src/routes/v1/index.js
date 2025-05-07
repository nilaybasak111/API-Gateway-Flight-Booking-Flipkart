const express = require("express");

const { InfoController } = require("../../controllers");
const { AuthRequestMiddlewares } = require("../../middlewares");

const UserRoute = require("./user-route");

const router = express.Router();

router.use("/user", UserRoute); // POST : /api/v1/user/signup/

// GET : /api/v1/info
router.get("/info",AuthRequestMiddlewares.checkAuth, InfoController.info);

module.exports = router;