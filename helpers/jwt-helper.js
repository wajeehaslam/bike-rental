const jwt = require("jsonwebtoken");

const assignToken = ({ email, _id, role }) => {
  return jwt.sign({ email, _id, role }, process.env.JWT_SECRET);
};

module.exports = assignToken;
