const mongoose = require("mongoose");
const config = require("config");

module.exports=function() {
  mongoose
    .connect(config.get("db"))
    .then(() => console.log("Connected To DB"))
    .catch(() => console.log("Could not connect to DB"));
}


