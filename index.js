const express = require("express");
const app = express();
const userRouter = require("./routes/user_router");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/dbconfig");
const rideRouter = require("./routes/ride_router");
const cityRouter = require("./routes/city_router");
/********************************************
 * ************Configuring Dependencies***********
 * ******************************************/

/*****************************************************
 * ***************Dependencies Express*********
 * *************************************************/
require("dotenv").config();
app.use(helmet()); // User to stop adding headers which can cayse potential security issue
app.use(bodyParser.json());
app.use(cors());

/*****************************************************
 * ***************Defining all Routes(mini apps)*********
 * *************************************************/
app.use("/user", userRouter);
app.use("/ride", rideRouter);
app.use("/city", cityRouter);

app.get("**", (req, res) => {
  res.send("sorry nothing for you");
});

var port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Backend is listening at port", port);
});
