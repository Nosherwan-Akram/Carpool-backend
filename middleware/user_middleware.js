const UserModel = require("../models/user_model");

module.exports.getDriverId = (req, res, next) => {
  UserModel.findOne({ username: req.body.payload.username }, (error, user) => {
    if (user) {
      req.body.driverId = user._id;
      next();
    }
  });
};

module.exports.getBookerId = (req, res, next) => {
  UserModel.findOne({ username: req.body.payload.username }, (err, user) => {
    if (user) {
      req.body.booker = user._id;
      next();
    }
  });
};

module.exports.adminMiddlewareCheck = (req, res, next) => {
  if (req.body.payload.role == "admin") {
    next();
  } else {
    res.status(405).json({ msg: "you should not be here" });
  }
};
