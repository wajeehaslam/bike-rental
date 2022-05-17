const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  bike: { type: Schema.Types.ObjectId, ref: "Bike" },
  startTime: Date,
  endTime: Date,
});

const Reservation = mongoose.model("Reservations", reservationSchema);

module.exports = Reservation;
