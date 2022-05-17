const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const bikeSchema = new mongoose.Schema(
  {
    model: String,
    color: String,
    location: String,
    isReserved: { type: Boolean, default: false },
  },
  { versionKey: false }
);

bikeSchema.plugin(mongoosePaginate);
const Bike = mongoose.model("Bike", bikeSchema);

module.exports = Bike;
