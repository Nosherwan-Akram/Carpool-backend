const jwt = require("jsonwebtoken");
const UserModel = require("../models/user_model");

module.exports.jwtHandler = (req, res) => {
  console.log(req.headers);
  jwt.verify(
    req.headers.authorization,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (decoded) {
        const token = jwt.sign(
          { username: decoded.username, role: decoded.role },
          process.env.SECRET_KEY,
          { algorithm: "HS256", expiresIn: "1h" }
        );
        UserModel.findOne({ username: decoded.username }, (err, user) => {
          if (user) {
            res.status(200).json({
              msg: "welcome back",
              msgtype: "success",
              payload: {
                username: user.username,
                role: user.role,
                picture: user.picture,
                token: token,
              },
            });
          }
        });
      } else {
        console.log(err);
        res.status(405).json({ msgtype: "error", msg: "Token expired" });
      }
    }
  );
};

module.exports.jwtMiddleware = (req, res, next) => {
  jwt.verify(
    req.headers.authorization,
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (decoded) {
        req.body.payload = decoded;
        next();
      } else {
        res.status(405).json({ msg: "token expired", msgtype: "error" });
      }
    }
  );
};
