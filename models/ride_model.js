const mongoose = require("mongoose");
const rideSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  carRegistration: { type: String, required: true },
  carDescription: { type: String, required: true },
  departureDate: { type: Date, required: true },
  availableSeats: { type: Number, max: 4 },
  estReachingTime: { type: Number, min: 1 },
});

module.exports = mongoose.model("ride", rideSchema);
