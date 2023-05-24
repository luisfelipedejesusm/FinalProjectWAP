const host = "localhost";
const port = "8000";
const url = `http://${host}:${port}`;
var productList = [];
var user = null;

(function () {
    let sessionKey = localStorage.getItem("user-session");
    if (sessionKey) {
        let [timestamp, username] = sessionKey.split("-");
        

        loadAuthenticatedIU(username);
    }else{
        loadUnauthenticatedIU();
    }
})()

async function login() {

    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let loginResult = await fetch(url + "/authentication/authenticate", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    if (loginResult.ok) {
        let data = await loginResult.json();
        localStorage.setItem("user-session", data.sessionKey);
        localStorage.setItem("user-shopping-cart", JSON.stringify(data.userCart));
        loadAuthenticatedIU(username);
    } else {
        alert("Username or password incorrect")
    }
}

function logout(){
    localStorage.removeItem("user-session");
    loadUnauthenticatedIU();
}

async function loadProductsTable(){
    let tbody = document.querySelector("#product-table tbody");
    tbody.innerHTML = "";

    let products = await fetch(url + "/product", {
        headers: {
            "Authorization": localStorage.getItem("user-session")
        }
    });
    let productsJson = await products.json();
    productList = productsJson

    for(let p of productsJson){
        tbody.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td><img src="${url + p.imageUrl}" width=70></td>
                <td>${p.stock}</td>
                <td><img class="addToCart" src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png" onclick="addProductToCart(${p.id})" width=30></td>
            </tr>
        `;
    }
}

function addProductToCart(productId){
    let cart = JSON.parse(localStorage.getItem("user-shopping-cart"));
    let product = productList.find(p => p.id == productId);

    if(product.stock == 0) return;

    let productIndex = cart.findIndex(item => item.id == product.id);
    if(productIndex > -1){
        if(cart[productIndex].qnt + 1 > product.stock)
        return;
        cart[productIndex].qnt += 1;
    }else{
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qnt: 1
        })
    }
    localStorage.setItem("user-shopping-cart", JSON.stringify(cart));
    updateServerCart();
    updateCartTable(cart);
}

function updateCartTable(cart){
    if(!cart.length) {
        document.getElementById("empty-cart").classList.remove("hidden")
        document.getElementById("shopping-cart").classList.add("hidden")
    }else{
        let tbody = document.querySelector("#shopping-cart-table tbody");
        tbody.innerHTML = "";
        for(let p of cart){
            tbody.innerHTML += `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.price}</td>
                    <td>${p.price * p.qnt}</td>
                    <td>
                        <button class="btn btn-light" onclick="updateCart(${p.id}, -1)"> - </button>
                        <span class="space-span">${p.qnt}</span>
                        <button class="btn btn-light" onclick="updateCart(${p.id}, 1)"> + </button>
                    </td>
                </tr>
            `;
        }

        let total = cart.reduce((acc, val) => acc + val.price * val.qnt, 0)

        document.getElementById("shopping-cart-total").innerText = `$${total}`
        document.getElementById("empty-cart").classList.add("hidden")
        document.getElementById("shopping-cart").classList.remove("hidden")
    }
}

function placeOrder(){
    let sessionKey = localStorage.getItem("user-session");
    let [timestamp, username] = sessionKey.split("-");
    let cart = JSON.parse(localStorage.getItem("user-shopping-cart"));
    fetch(url + "/shoppingCart/placeOrder/" + username, {
        method: "POST",
        headers: {
            "Authorization": localStorage.getItem("user-session"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cart: cart
        })
    }).then(function(response){
        localStorage.setItem("user-shopping-cart", "[]")
        loadProductsTable();
        loadShoppingCart();
    })
}

function updateCart(productId, amount){
    let cart = JSON.parse(localStorage.getItem("user-shopping-cart"));
    let product = productList.find(p => p.id == productId);

    let productIndex = cart.findIndex(item => item.id == product.id);

    if(cart[productIndex].qnt + amount < 0 || cart[productIndex].qnt + amount > product.stock)
        return;

    if(cart[productIndex].qnt + amount == 0){
        cart = cart.filter(item => item.id != product.id);
    }else{
        cart[productIndex].qnt += amount;
    }

    localStorage.setItem("user-shopping-cart", JSON.stringify(cart));
    updateServerCart();
    updateCartTable(cart);
}

function loadShoppingCart(){
    let cart = JSON.parse(localStorage.getItem("user-shopping-cart"));
    updateCartTable(cart);
}

function updateServerCart(){
    let sessionKey = localStorage.getItem("user-session");
    let [timestamp, username] = sessionKey.split("-");
    let cart = JSON.parse(localStorage.getItem("user-shopping-cart"));
    fetch(url + "/shoppingCart/" + username, {
        method: "POST",
        headers: {
            "Authorization": localStorage.getItem("user-session"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cart: cart
        })
    })
}


function loadAuthenticatedIU(username) {
    Array.from(document.getElementsByClassName("unauthenticated")).forEach(el => el.classList.add("hidden"));
    Array.from(document.getElementsByClassName("authenticated")).forEach(el => el.classList.remove("hidden"));
    document.getElementById("username").innerText = username;
    loadProductsTable();
    loadShoppingCart();
}

function loadUnauthenticatedIU() {
    Array.from(document.getElementsByClassName("authenticated")).forEach(el => el.classList.add("hidden"));
    Array.from(document.getElementsByClassName("unauthenticated")).forEach(el => el.classList.remove("hidden"));
}