const express = require("express");
const bcrypt = require("bcrypt");
const authGuard = require("../helpers/auth-guard");
const roleGuard = require("../helpers/role-guard");
const User = require("../models/User");
const assignToken = require("../helpers/jwt-helper");
const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const query = JSON.parse(req.query.query || `{}`);
    const users = await User.paginate(query, {
      customLabels: { docs: "users" },
    });
    res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").select("-salt");
    return res.status(200).send(user || {});
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

// Create User
router.post(
  "/",
  authGuard,
  roleGuard("manager"),
  async function (req, res, next) {
    try {
      const { email, password, name } = req.body;
      const user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(401).send({
          message: "Email already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await User.create({ email, name, password: hash, salt });
      return res.status(200).send({
        message: "User registered Successfully",
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
      });
    }
  }
);

// Create User
router.delete(
  "/:id",
  authGuard,
  roleGuard("manager"),
  async function (req, res, next) {
    try {
      const { id } = req.params;
      await User.deleteOne({ _id: id });
      return res.status(200).send({
        message: "User deleted Successfully",
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
      });
    }
  }
);

// update User
router.put(
  "/:id",
  authGuard,
  roleGuard("manager"),
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      const user = await User.findOne({
        _id: id,
      });
      if (!user) {
        return res.status(401).send({
          message: "Invalid user id",
        });
      }
      const updatePayload = {};
      if (name) {
        updatePayload.name = name;
      }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        updatePayload.password = hash;
        updatePayload.salt = salt;
      }
      if (email) {
        updatePayload.email = email;
      }
      const updatedUser = await User.findByIdAndUpdate(id, updatePayload, {
        new: true,
      })
        .lean()
        .select("-password")
        .select("-salt");

      return res.status(200).send({ ...updatedUser });
    } catch (error) {
      console.log(error);
      if (error.name === "MongoServerError" && error.code === 11000) {
        return res.status(500).send({
          message: "User with this email is already exists",
        });
      } else {
        res.status(500).send({
          message: error.message || "Internal server error",
        });
      }
    }
  }
);

module.exports = router;
