let db = require("../service/dataStorageService")
let User = require("../model/user")
const bcrypt = require('bcrypt');
const salt = 10;

let controller = {
    authenticate: async function(req, res, next){
        let user = db.user.getFirstByUsername(req.body.username);
        if(!user){
            res.status(404).json({msg: "User Not Found"});
        }else{
            let isValid = await bcrypt.compare(req.body.password, user.password);
            if(isValid)
                res.status(200).json({sessionKey: `${+Date.now()}-${user.username}`, userCart: user.shoppingCart});
            else
                res.status(403).json({msg: "Incorrect user or password"});
        }
    },
    register: async function(req, res, next){
        let encryptedPassword = await bcrypt.hash(req.body.password, salt);
        let user = new User(req.body.username, encryptedPassword);
        db.user.save(user);
        res.status(200).json(user);
    }
}

module.exports = controller;