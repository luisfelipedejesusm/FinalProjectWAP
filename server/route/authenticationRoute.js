let express = require("express");

// import controller
let authenticationController = require("../controller/authenticationController");

let router = express.Router();

// create routes
router.post('/authenticate', authenticationController.authenticate);
router.post('/register', authenticationController.register);

module.exports = router;