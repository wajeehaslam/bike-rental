var express = require('express');
var router = express.Router();

/* Default test route */
router.get('/', function (req, res, next) {
  res.status(200).send({ message: "Hola, server is alive!" });
});

module.exports = router;
