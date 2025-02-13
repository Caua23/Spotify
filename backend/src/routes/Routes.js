const express = require("express");
const auth = require("./auth.routes.js");
const user = require("./user.routes.js");
const spotify = require("./spotify.routes.js");
const musica = require("./musica.routes.js");
const routes = express.Router();
require("dotenv").config();


routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/track", musica);
routes.use("/", spotify);


module.exports = routes;
