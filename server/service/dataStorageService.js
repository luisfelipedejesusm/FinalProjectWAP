let Product = require("../model/product")
let User = require("../model/user")
const bcrypt = require('bcrypt');
const salt = 10;

let _db = {
    users: [],
    products: []
};

let db = {
    user: {
        getFirstByUsername: username => _db.users.find(user => user.username == username),
        save: user => _db.users.push(user),
        updateShoppingCart: (username, cart) => {
            _db.users.find(user => user.username == username).shoppingCart = cart
        },
        getAll: _ => _db.users
    },
    products: {
        getAll: _ => _db.products,
        findById: id => _db.products.find(p => p.id == id),
        updateStock: (id, stock) => _db.products.find(p => p.id == id).stock = stock,
        save: product => _db.products.push(product)
    },
    init: async function(){
        let user = await getUser("admin", "1234")
        this.user.save(user);

        this.products.save(new Product("Iphone", 1500, "/img/iphone.png", 10));
        this.products.save(new Product("Samsuing s20 Ultra", 1400, "/img/samsung.png", 15));
        this.products.save(new Product("Macbook Pro", 3500, "/img/macbook.png", 3));
        this.products.save(new Product("Ipad", 900, "/img/ipad.png", 7));
    }
}

async function getUser(username, password){
    let encryptedPassword = await bcrypt.hash(password, salt);
    let user = new User(username, encryptedPassword);
    return user;
}

module.exports = db;