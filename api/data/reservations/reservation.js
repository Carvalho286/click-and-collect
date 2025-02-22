let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let reservationSchema = new Schema({
  dishes: [
    {
      dishId: { type: Schema.Types.ObjectId, ref: "dishes", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  client: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: "guests",
    required: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled", "completed"],
    default: "pending",
  },
  reservationTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let reservation = mongoose.model("Reservation", reservationSchema);

module.exports = reservation;
