let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let scopes = require("./scopes");

let roleSchema = new Schema({
  name: { type: String, required: true },
  scopes: [
    {
      type: String,
      enum: [scopes["admin"], scopes["chef"], scopes["employee"], scopes["client"]],
    },
  ],
});

let userSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  role: {
    type: roleSchema,
    required: true,
    default: {
      name: "Client",
      scopes: ["client"],
    },
  },
  email: {
    type: "string",
    unique: true,
  },
  phone: {
    type: "string",
    required: true,
    unique: true,
  },
  address: {
    type: "string",
    required: true,
  },
  postalCode: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
});

let user = mongoose.model("User", userSchema);

module.exports = user;
