const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  model: String,
  color: String,
  location: String,
  isReserved: Boolean,
  rating: String,
});

const Bike = mongoose.model("Bike", bikeSchema);

module.exports = Bike;
