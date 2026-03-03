let user = localStorage.getItem("user")

if(!user){
    window.location.href = "login.html"; // open login page.
}
document.getElementById("userEmail").innerHTML= user; // set email id in dashboard page.

let foodSelection = document.getElementById("foodSelection");   // reference of food selection section in dashboard page using id selector 
let cartSelection = document.getElementById("cartSelection");   // reference of cart selection section in dashboard page using id selector 

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html"; // open login page. 
}


foodSelection.style.display = ""; // let Tailwind grid handle layout
cartSelection.style.display = "none"; // hide cart selection section

function showFoodSelection(){
    foodSelection.style.display = ""; // let Tailwind grid handle layout
    cartSelection.style.display = "none"; // hide cart selection section
}
function showCartSelection(){
    foodSelection.style.display = "none"; // hide food selection section
    cartSelection.style.display = ""; // let Tailwind handle layout
}

let FOOD_URL = "https://www.themealdb.com/api/json/v1/1/search.php?f=a"

fetch(FOOD_URL).then(response=>response.json()).
then(data=>{
    //console.log(data.meals)
    displayFood(data.meals)

}).catch(error=> {
    console.log(error)
})

function displayFood(meals){
 meals.forEach(meal=> {


    let price = Math.floor(Math.random()*10) + 5; // generate random price for food items
   
    foodSelection.innerHTML +=`
        <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <div class="w-full aspect-square mb-2 overflow-hidden flex items-center justify-center">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
                    class="object-cover w-full h-full rounded-lg max-h-48" />
            </div>
            <h3 class="text-lg font-semibold text-center">${meal.strMeal}</h3>
            <p class="text-gray-800 text-sm text-center">Price: $${price}</p>
            <input type="button" value = "Add To Cart"
                onclick="addToCart(${meal.idMeal},'${meal.strMeal}',${price})"
                class="bg-orange-400 text-white py-2 rounded-md hover:bg-orange-400 transition-colors duration-300 cursor-pointer w-full mt-2" />
        </div>
    `
   
 })   
}

let cart = []; 
document.getElementById("cartCount").innerHTML = `Items in Cart: ${cart.length}`; 
function addToCart(mealId, mealName, price){
    
    
    let item  = cart.find(c=>c.mealId === mealId); 
    
    if(item){
        item.quantity += 1; 
    }else {
        cart.push({mealId, mealName, price, quantity: 1}); // add new item to cart with quantity 1
        document.getElementById("cartCount").innerHTML = `Cart Items: ${cart.length}`; // display cart 
    }
    console.log("After added to cart", cart )
    updateCart(); // update cart section in dashboard page after adding item to cart
}

function updateCart() {
    let cartItem = document.getElementById("cartItem");
    cartItem.innerHTML = ""; // clear previous cart items before displaying updated cart items

    let total = 0;
    cart.forEach(item => {
        cartItem.innerHTML += `
            <div class="bg-yellow-300/75 rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 class="text-lg font-semibold mb-1">${item.mealName}</h3>
                    <p class="text-gray-700 mb-1">Price: <span class="font-medium">$${item.price}</span></p>
                    <p class="text-gray-700 mb-2">Quantity: <span class="font-medium">${item.quantity}</span></p>
                </div>
                <div class="flex space-x-2 mt-2 md:mt-0">
                    <input type="button" value="+" onClick="changeQuantity(${item.mealId}, 1)"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded cursor-pointer"/>
                    <input type="button" value="-" onClick="changeQuantity(${item.mealId}, -1)"
                        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded cursor-pointer"/>
                </div>
            </div>
        `;
        total += item.price * item.quantity;
    });
    if(cart.length > 0) {
        cartItem.innerHTML += `<div class="text-left mt-4"><h3 class="text-xl font-bold">Total Amount: <span class="text-green-600">$${total}</span></h3></div>`;

    }
}

// as of now working with only item 
function changeQuantity(mealId, change){
    cart = cart.map(item => {
        if(item.mealId === mealId){
            item.quantity += change; // change quantity by adding change value (can be positive or negative)
        }
       return item;
    }).filter(item => item.quantity > 0); // remove item from cart if quantity is less than or equal to 0  

    updateCart(); // update cart section in dashboard page after changing quantity
}

function checkOut(){
    if(cart.length === 0){
        alert("Cart is empty. Please add items to cart before checkout.");
        return false;
    }else {
        alert("Checkout successful! We're cooking up something good 🍽");
        cart = []; // clear cart after successful checkout
        document.getElementById("cartCount").innerHTML = `Cart Items: ${cart.length}`; // update cart item count in dashboard page after checkout
        updateCart(); // update cart section in dashboard page after checkout
    }
}