const express = require("express");
const router = express.Router();

const UserController = require("../controller/user.controller");
const path = require("path");

router.get("/", UserController.home);

router.get("/intl", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../../Web/", "views", "indexSemLogin.html")
  );
});
router.get("/Sucess", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../Web/", "views", "index.html"));
});
module.exports = router;
