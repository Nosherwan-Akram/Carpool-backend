const User = require("../models/user_model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.login = (req, res) => {
  console.log(req.body);
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { username: user.username, role: user.role },
            process.env.SECRET_KEY,
            { algorithm: "HS256", expiresIn: "1h" }
          );
          res.set("token", token);
          res.json({
            msg: "Successfully Logged In",
            msgtype: "success",
            payload: {
              username: user.username,
              role: user.role,
              picture: user.picture,
              token: token,
            },
          });
        } else {
          res
            .status(401)
            .send({ msg: "Password does not match", msgtype: "error" });
        }
      });
    } else {
      res.status(404).send({ msg: "User does not exist", msgtype: "error" });
    }
  });
};

module.exports.signUp = (req, res) => {
  let picture = null;
  if (req.body.picture) {
    picture = req.body.picture;
  }
  let hashPassword = "";
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    hashPassword = hash;
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      role: "user",
      picture: picture,
    });
    user.save((err, user) => {
      if (user) {
        res
          .status(200)
          .json({ msg: "Registered Successfully", msgtype: "success" });
      } else if (err.name === "MongoError" && err.code === 11000) {
        res
          .status(406)
          .json({ msg: "username, or email is duplicate", msgtype: "error" });
      }
      if (err) {
        console.log(err);
      }
    });
  });
};
