const RideModel = require("../models/ride_model");
const BookingModel = require("../models/booking_model");
const mongoose = require("mongoose");
module.exports.createRide = (req, res) => {
  console.log(req.body);
  let ride = new RideModel(req.body);
  ride.save((err, ride) => {
    if (ride) {
      res.status(200).json({ msg: "ride saved", msgtype: "success" });
    } else if (err) {
      res
        .status(400)
        .json({ msg: "something went wrong with your data", msgtype: "error" });
    }
  });
};

module.exports.getAllRides = (req, res) => {
  RideModel.find({}, (err, rides) => {
    if (rides) {
      res
        .status(200)
        .json({ msg: "found all rides", msgtype: "succes", payload: rides });
    } else if (err) {
      res.status(404).json({
        msg: "something went wrong could not find rides",
        msgtype: "error",
      });
    }
  });
};

module.exports.searchRides = (req, res) => {
  RideModel.find({})
    .populate("driverId", ["username", "picture", "email"])
    .exec((err, rides) => {
      if (rides && rides.length != 0) {
        rides = rides.filter((ride) => {
          if (
            sameDay(
              new Date(req.body.departureDate),
              new Date(ride.departureDate)
            ) &&
            req.body.destination == ride.destination &&
            req.body.departure == ride.departure
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (rides.length == 0) {
          res
            .status(404)
            .json({ msg: "no rides found", msgtype: "information" });
        } else {
          res
            .status(200)
            .json({ msg: "rides found", msgtype: "success", payload: rides });
        }
      } else if (err) {
        res.status(400).json({ msg: "something went wrong", msgtype: "error" });
      } else {
        res.status(400).json({ msg: "no rides found", msgtype: "error" });
      }
    });
};

module.exports.bookRide = (req, res) => {
  RideModel.findOne({ _id: req.body.rideId }, (err, ride) => {
    if (ride && ride.availableSeats < 4) {
      RideModel.findByIdAndUpdate(
        req.body.rideId,
        { availableSeats: ride.availableSeats - 1 },
        (err, rideUpdate) => {
          let booking = new BookingModel(req.body);
          booking.save((err, booked) => {
            if (booked) {
              res.status(200).json({ msg: "ride booked" });
            } else {
              res.status(400).json({ msg: "something went wrong" });
            }
          });
        }
      );
    } else if (err) {
      console.log(err);
    } else {
      res.status(404).json({ msg: "could not find rides" });
    }
  });
};

module.exports.getDriverRides = (req, res) => {
  RideModel.find({ driverId: req.body.driverId })
    .populate("driverId", ["username", "picture", "email"])
    .exec((err, rides) => {
      if (rides) {
        res.status(200).json({ msg: "found rides", payload: rides });
      } else {
        res.status(404).json({ msg: "could not find rides" });
      }
    });
};

module.exports.getBookedRides = (req, res) => {
  BookingModel.find({ booker: req.body.booker })
    .populate({
      path: "rideId",
      populate: { path: "driverId", select: ["username", "picture", "email"] },
    })
    .exec((err, rides) => {
      if (rides) {
        res.status(200).json({ msg: "found rides", payload: rides });
      } else {
        res.status(404).json({ msg: "rides not found" });
      }
    });
};

module.exports.cancelRide = (req, res) => {
  console.log(req.body);
  BookingModel.findOneAndDelete(
    { booker: req.body.booker, rideId: req.body._id },
    (err, booking) => {
      if (booking) {
        RideModel.findByIdAndUpdate(
          req.body._id,
          { availableSeats: req.body.availableSeats + 1 },
          (err, ride) => {
            console.log(err);
            if (ride) {
              res.status(200).json({ msg: "ride canceled" });
            } else {
              res.status(404).json({ msg: "some error came" });
            }
          }
        );
      } else {
        res.status(404).json({ msg: "ride does not exit" });
      }
    }
  );
};
function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
