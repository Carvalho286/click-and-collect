let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  phone: {
    type: "string",
    required: true,
  },
  address: {
    type: "string",
    required: true,
  },
  postalCode: {
    type: "string",
    required: true,
  },
});

let user = mongoose.model("User", userSchema);

module.exports = user;
