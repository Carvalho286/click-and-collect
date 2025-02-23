let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let guestSchema = new Schema({
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
    required: false,
  },
  postalCode: {
    type: "string",
    required: false,
  },
});

let guest = mongoose.model("Guest", guestSchema);

module.exports = guest;
