let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let dishSchema = new Schema({
  name: {
    type: "String",
    required: true,
    unique: true,
  },
  description: {
    type: "String",
    required: true,
  },
  price: {
    type: "Number",
    required: true,
  },
  categories: {
    type: ["String"],
    required: true,
  },
  availability: {
    type: "Boolean",
    required: true,
    default: true,
  },
  imageUrl: {
    type: "String",
    required: false,
  },
});

let dish = mongoose.model("Dish", dishSchema);

module.exports = dish;
