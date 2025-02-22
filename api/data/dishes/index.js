const Dishes = require("./dish");
const DishService = require("./service");

const service = new DishService(Dishes);

module.exports = service;
