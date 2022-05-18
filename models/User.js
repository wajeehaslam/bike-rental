const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true, dropDups: true },
    role: {
      type: String,
      enum: ["user", "manager"],
      default: "user",
    },
    password: { type: String },
    salt: { type: String },
    reservationCount: { type: Number },
  },
  { versionKey: false, timestamps: true }
);
userSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", userSchema);

module.exports = User;
