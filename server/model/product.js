class Product {
    static #autoincrementedIdGenerator = 1;
    constructor(name, price, imageUrl, stock) {
        this.id = Product.#autoincrementedIdGenerator++;
        this.name = name;
        this.price = price
        this.imageUrl = imageUrl
        this.stock = stock
    }
}

module.exports = Product;