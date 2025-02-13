const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");

const path = require("path");
const multer = require("multer");
const multerConfig = require("../config/multer/multer.js");

router.get("/data/:id", 
  UserController.getUser
);

router.post(
  "/account/overview",
  multer(multerConfig).single("file"),
  UserController.updateUser
);



router.get("/account/overview", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "account.html"));
  });
module.exports = router;
