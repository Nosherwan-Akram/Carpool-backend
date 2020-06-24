const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: null },
  picture: { type: String, default: null },
});

module.exports = mongoose.model("user", userSchema);
