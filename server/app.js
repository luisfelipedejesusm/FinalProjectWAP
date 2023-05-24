const express = require('express');
const swaggerJsdoc = require("swagger-jsdoc");
let swaggerUi = require("swagger-ui-express");

let db = require("./service/dataStorageService")

// import routes
const authenticationRouter = require("./route/authenticationRoute");
const productRouter = require("./route/productRoute");
const shoppingCartRouter = require("./route/shoppingCartRoute");

const cors = require('cors');
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());


// use routes
app.use("/authentication", authenticationRouter);

app.use(express.static('public'))

app.use(function (req, res, next) {
    let sessionKey = req.get("Authorization");
    if (sessionKey)
        next();
    else
        res.status(403).json({ msg: "Unauthenticated" });
});

app.use("/product", productRouter);
app.use("/shoppingCart", shoppingCartRouter);


app.get("/*", function (req, res) {
    console.log("route hit");
    res.status(404).json({ msg: "page not found" });
})



app.listen(8000, () => {
    console.log("server running...")
    console.log("Inserting initial values...")
    db.init();
    console.log("Initial values inserted")

});


