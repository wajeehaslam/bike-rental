const express = require("express");
const authGuard = require("../helpers/auth-guard");
const roleGuard = require("../helpers/role-guard");
const User = require("../models/User");
const router = express.Router();

router.get("/", authGuard, async function (req, res, next) {
  const users = await User.paginate({}, { customLabels: { docs: "users" } });
  // res.send(200).json({ users, message: "Users found successfully!" });
  res.send(users);
});

router.get("/me", authGuard, async function (req, res) {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    res.status(200).send({
      user,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
