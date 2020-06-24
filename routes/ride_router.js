const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride_controller");
const jwtMiddleware = require("../middleware/jwt_middleware");
const userMiddleware = require("../middleware/user_middleware");

router.use(jwtMiddleware.jwtMiddleware);

router.post(
  "/createRide",
  userMiddleware.getDriverId,
  rideController.createRide
);
router.get(
  "/allRides",
  userMiddleware.adminMiddlewareCheck,
  rideController.getAllRides
);
router.post("/searchRides", rideController.searchRides);
router.post("/bookRide", userMiddleware.getBookerId, rideController.bookRide);
router.get(
  "/getDriverRides",
  userMiddleware.getDriverId,
  rideController.getDriverRides
);
router.get(
  "/getBookedRides",
  userMiddleware.getBookerId,
  rideController.getBookedRides
);
router.post(
  "/cancelRide",
  userMiddleware.getBookerId,
  rideController.cancelRide
);

module.exports = router;
