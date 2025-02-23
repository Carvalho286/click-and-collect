const express = require("express");
let AuthAPI = require("./server/auth");
let UsersAPI = require("./server/user");
let GuestsAPI = require("./server/guest");
let DishesAPI = require("./server/dish");

function initialize() {
  let api = express();

  api.use("/auth", AuthAPI());
  api.use("/users", UsersAPI());
  api.use("/dishes", DishesAPI());
  api.use("/guests", GuestsAPI());

  return api;
}

module.exports = {
  initialize: initialize,
};
