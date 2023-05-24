let express = require("express");

// import controller
let productController = require("../controller/productController");

let router = express.Router();

// create routes
router.get("/", productController.getAll);
router.get("/:id", productController.findById);
router.post("/", productController.save);

module.exports = router;