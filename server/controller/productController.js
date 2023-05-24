let db = require("../service/dataStorageService")
let Product = require("../model/product")

let controller = {
    getAll: (req, res, next) => {
        res.status(200).json(db.products.getAll());
    },
    findById: (req, res, next) => {
        let id = req.body.productId;
        res.status(200).json(db.products.findById(id));
    },
    save: (req, res, next) => {
        let product = new Product(
            req.body.name,
            req.body.price,
            req.body.imageUrl,
            req.body.stock
        );
        db.products.save(product);
        res.status(200).json({msg: "product added"});
    },
}

module.exports = controller;