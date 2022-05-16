const jwt = require("jsonwebtoken");
/**
 * @description authGuard is a middleware that handles authentications
 * @param {request} req
 * @param {response} res
 * @param {next} next
 * @returns decoded user
 */
const roleGuard = (role) => (req, res, next) => {
  const { user } = req;
  if (user.role === role) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = roleGuard;
