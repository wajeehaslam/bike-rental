const express = require("express");
const authGuard = require("../helpers/auth-guard");
const roleGuard = require("../helpers/role-guard");
const Bike = require("../models/Bike");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
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

router.get(
  "/myReservation",
  authGuard,
  roleGuard("user"),
  async function (req, res) {
    try {
      const { userId, limit, page } = req.query;
      const reservations = await Reservation.paginate(
        { user: userId },
        {
          customLabels: { docs: "reservations" },
          populate: ["user", "bike"],
          limit,
          page,
        }
      );
      res.status(200).send(reservations);
    } catch (error) {
      return res.status(500).send({
        message: error.message || "internal server error",
      });
    }
  }
);

router.post("/", authGuard, roleGuard("user"), async function (req, res) {
  try {
    const { bikeId, startTime } = req.body;
    await Reservation.create({
      user: req.user._id,
      bike: bikeId,
      startTime,
    });

    await Bike.updateOne(
      {
        _id: bikeId,
      },
      {
        isReserved: true,
      }
    );
    const user = await User.findById(req.user._id);
    if (user)
      await user.update({ reservationCount: (user.reservationCount || 0) + 1 });

    res.status(200).send({
      message: "Bike reserved!",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

router.post(
  "/cancelReservation",
  authGuard,
  roleGuard("user"),
  async function (req, res) {
    try {
      const { endTime, rating } = req.body;

      await Bike.updateOne(
        {
          _id: bikeId,
        },
        {
          isReserved: true,
        }
      );
      await Reservation.create({
        user: req.user._id,
        bike: bikeId,
        startTime,
      });

      await Bike.updateOne(
        {
          _id: bikeId,
        },
        {
          isReserved: true,
        }
      );
      res.status(200).send({
        message: "Bike reserved!",
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message || "internal server error",
      });
    }
  }
);

module.exports = router;
