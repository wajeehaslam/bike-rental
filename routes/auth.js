const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const assignToken = require("../helpers/jwt-helper");
const authGuard = require("../helpers/auth-guard");

router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(403).send({
        message: "Invalid params",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(403).send({
        message: "Invalid email and password combination.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, user.salt);

    if (hashedPassword === user.password) {
      const token = assignToken({
        email: user.email,
        _id: user._id,
        role: user.role,
      });
      res.status(200).send({
        token,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      return res.status(403).send({
        message: "Invalid email and password combination.",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/signup", async function (req, res) {
  try {
    const payload = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(payload.password, salt);
    const user = await User.create({ ...payload, password: hash, salt });
    const token = assignToken({
      email: user.email,
      _id: user._id,
      role: "user",
    });
    res.status(200).send({
      _id: user.id,
      token: token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(500).send({
        message: "Email already exists",
      });
    }
    return res.status(500).send(error);
  }
});

router.post("/registerManger", async function (req, res) {
  try {
    const payload = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(payload.password, salt);
    const user = await User.create({
      ...payload,
      password: hash,
      salt,
      role: "manager",
    });
    const token = assignToken({
      email: user.email,
      _id: user._id,
      role: "manager",
    });
    res.status(200).send({
      token: token,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(500).send({
        message: "Email already exists",
      });
    }
    return res.status(500).send(error);
  }
});

router.get("/me", authGuard, async function (req, res) {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select("-password").select("-salt");
    res.status(200).send({
      user,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "internal server error",
    });
  }
});

module.exports = router;
