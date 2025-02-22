const Guests = require("./guest");
const GuestService = require("./service");

const service = new GuestService(Guests);

module.exports = service;
