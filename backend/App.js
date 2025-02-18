const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
//----------------------------------------------------------//
const publicPath = path.join(__dirname, "../web/public");
app.use(express.static(publicPath));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));


//----------------------------------------------------------------\\
const staticFolders = [
  { route: "login", folder: "Login" },
  { route: "signup", folder: "SignUp" },
  { route: "index", folder: "index" },
  { route: "acc", folder: "account" },
  { route: "AudioInfo", folder: "AudioInfo" },
  { route: "audio", folder: "audio" },
];

staticFolders.forEach(({ route, folder }) => {
  app.use(
    `/${route}/css`,
    express.static(path.join(publicPath, folder, "css"))
  );
  app.use(`/${route}/js`, express.static(path.join(publicPath, folder, "js")));
});

//----------------------------------------------------------------\\
//assets
app.use("/Assets", express.static(path.join(__dirname, "../web/src/Assets")));
app.use("/Tmp", express.static(path.join(__dirname, "./src/tmp/uploads")));
app.use("/Sounds", express.static(path.join(__dirname, "./src/tmp/Som")));
app.use(
  "/ImgSounds",
  express.static(path.join(__dirname, "./src/tmp/Som/Imgs"))
);
//Router
const routes = require("./src/routes/Routes.js");
app.use(routes);

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log("Server esta rodando em http://localhost:" + port);
});
