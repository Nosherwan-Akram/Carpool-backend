const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middleware/jwt_middleware");
const userMiddleware = require("../middleware/user_middleware");
const cityController = require("../controllers/city_controller");

router.use(jwtMiddleware.jwtMiddleware);

router.post(
  "/createCity",
  userMiddleware.adminMiddlewareCheck,
  cityController.createCity
);
router.get("/getAllCities", cityController.getAllCities);

module.exports = router;
