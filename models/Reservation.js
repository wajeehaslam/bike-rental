const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike" },
    startTime: Date,
    endTime: Date,
    rating: { type: Number },
    status: { type: String },
  },
  { timestamps: true }
);

reservationSchema.plugin(mongoosePaginate);
const Reservation = mongoose.model("Reservations", reservationSchema);

module.exports = Reservation;
