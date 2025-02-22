const express = require("express");
let AuthAPI = require("./server/auth");
let UsersAPI = require("./server/user");

function initialize() {
  let api = express();

  api.use("/auth", AuthAPI());
  api.use("/users", UsersAPI());

  return api;
}

module.exports = {
  initialize: initialize,
};
