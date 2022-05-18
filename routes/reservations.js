const express = require("express");
const authGuard = require("../helpers/auth-guard");
const roleGuard = require("../helpers/role-guard");
const Reservation = require("../models/Reservation");
const router = express.Router();

router.get("/", authGuard, roleGuard("manager"), async function (req, res) {
  try {
    const reservations = await Reservation.paginate(
      {},
      { customLabels: { docs: "reservations" } }
    );
    res.status(200).send(bikes);
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

router.post("/", authGuard, roleGuard("user"), async function (req, res) {
  try {
    const { bikeId, startTime, endTime } = req.body;
    await Reservation.create({
      user: req.user._id,
      bike: bikeId,
      startTime,
      endTime,
    });
    res.status(200).send({
      message: "Bike reserved!",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

module.exports = router;
