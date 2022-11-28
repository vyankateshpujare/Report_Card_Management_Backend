const express = require("express");

const app = express();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/port")(app);

module.exports = app;
