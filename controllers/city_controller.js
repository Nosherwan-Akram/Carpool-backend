const CityModel = require("../models/city_model");
module.exports.createCity = (req, res) => {
  let city = new CityModel({
    name: req.body.name,
  });

  city.save((err, city) => {
    if (city) {
      res.status(200).json({ msg: "city created", msgtype: "success" });
    } else if (err) {
      res.status(404).json({ msg: "city is duplicate", msgtype: "error" });
    }
  });
};

module.exports.getAllCities = (req, res) => {
  CityModel.find({}, (err, cities) => {
    if (cities) {
      res
        .status(200)
        .json({ msg: "cities found", msgtype: "success", payload: cities });
    } else {
      res.status(404).json({
        msg: "cities do not exist or could not fetch them",
        msgtype: "error",
      });
    }
  });
};
