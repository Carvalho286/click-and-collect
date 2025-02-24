const express = require("express");
let AuthAPI = require("./server/auth");
let UsersAPI = require("./server/user");
let GuestsAPI = require("./server/guest");
let DishesAPI = require("./server/dish");
let ReservationsAPI = require("./server/reservation");

function initialize() {
  let api = express();

  api.use("/auth", AuthAPI());
  api.use("/users", UsersAPI());
  api.use("/dishes", DishesAPI());
  api.use("/guests", GuestsAPI());
  api.use("/reservations", ReservationsAPI());

  return api;
}

module.exports = {
  initialize: initialize,
};
