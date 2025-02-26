const config = require("./config");
const express = require("express");
const http = require("http");
const path = require("path");
var mongoose = require("mongoose");

const hostname = "localhost";
const port = 2828;
let router = require("./router");

var app = express();
app.use(router.initialize());
app.use("/images", express.static(path.join(__dirname, "images")));
const server = http.Server(app);
mongoose
  .connect(config.db)
  .then(() => console.log("Connection Successfull"))
  .catch((err) => console.error(err));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
