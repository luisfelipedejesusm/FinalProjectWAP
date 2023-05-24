class User {
    static #autoincrementedIdGenerator = 1;
    constructor(username, password) {
        this.id = User.#autoincrementedIdGenerator++;
        this.username = username;
        this.password = password;
        this.shoppingCart = [];
    }
}

module.exports = User;