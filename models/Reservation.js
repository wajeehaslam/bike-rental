const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike" },
    startTime: Date,
    endTime: Date,
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservations", reservationSchema);

module.exports = Reservation;
