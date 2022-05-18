const express = require("express");
const authGuard = require("../helpers/auth-guard");
const roleGuard = require("../helpers/role-guard");
const Bike = require("../models/Bike");
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const query = JSON.parse(req.query.query || `{}`);
    const { page, limit } = req.query;
    const bikes = await Bike.paginate(query, {
      customLabels: { docs: "bikes" },
      page,
      limit,
    });
    res.status(200).send(bikes);
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

router.get("/:id", authGuard, async function (req, res) {
  try {
    const { id } = req.params;
    const bike = await Bike.findById(id);
    res.status(200).send({
      bike,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

router.post("/", authGuard, roleGuard("manager"), async function (req, res) {
  try {
    const { color, model, location } = req.body;
    const bike = await Bike.create({
      model,
      color,
      location,
    });
    res.status(200).send({
      bike,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

router.delete(
  "/:id",
  authGuard,
  roleGuard("manager"),
  async function (req, res) {
    try {
      const { id } = req.params;
      await Bike.findByIdAndDelete(id);
      return res.status(200).send({
        message: "Bike deleted successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message || "internal server error",
      });
    }
  }
);

router.put("/:id", authGuard, roleGuard("manager"), async function (req, res) {
  try {
    const { id } = req.params;
    const { model, color, location } = req.body;

    const bike = await Bike.findById(id);
    if (!bike) {
      return res.status(403).send({
        message: "No bike registered with this id",
      });
    }
    const updatePayload = {};
    if (model) {
      updatePayload.model = model;
    }
    if (color) {
      updatePayload.color = color;
    }
    if (location) {
      updatePayload.location = location;
    }
    await Bike.findByIdAndUpdate(id, updatePayload);
    return res.status(200).send({
      message: "Bike updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

module.exports = router;
