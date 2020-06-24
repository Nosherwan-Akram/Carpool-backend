const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const jwtMiddleware = require("../middleware/jwt_middleware");

router.post("/login", userController.login);
router.post("/signUp", userController.signUp);
router.get("/checkToken", jwtMiddleware.jwtHandler);

module.exports = router;
