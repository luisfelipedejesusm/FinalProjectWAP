let db = require("../service/dataStorageService")

let controller = {
    updateCart: function(req, res, next){
        let username = req.params.username;
        db.user.updateShoppingCart(username, req.body.cart);
        res.status(200).json({msg: "update sucessful"});
    },
    placeOrder: function(req, res, next){
        let cart = req.body.cart;
        let username = req.params.username;
        for(let item of cart){
            let product = db.products.findById(item.id);
            if(product.stock < item.qnt){
                res.status(500).json({msg: "Quantity grater than stock for product: " + product.name})
                return;
            }
        }
        for(let item of cart){
            let product = db.products.findById(item.id);
            db.products.updateStock(product.id, product.stock - item.qnt);
        }

        db.user.updateShoppingCart(username, []);
        res.status(200).json({msg: "update sucessful"});
    }
}

module.exports = controller;