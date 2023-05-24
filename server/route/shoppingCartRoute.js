let express = require("express");

// import controller
let shoppingCartController = require("../controller/shoppingCartController");

let router = express.Router();

// create routes
router.post("/:username", shoppingCartController.updateCart);
router.post("/placeOrder/:username", shoppingCartController.placeOrder);

module.exports = router;