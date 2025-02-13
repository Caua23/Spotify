const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const path = require("path");

router.post("/login", UserController.login);

router.post("/signUp", UserController.createUser);

router.post("/jwtAuthenticate", UserController.protectedRoute)

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../Web", "views", "Login.html"));
});

router.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../Web/", "views", "SingUp.html"));
});
router.get("/signUp/phone", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../Web/", "views", "SingUp.html"));
});
module.exports = router;
