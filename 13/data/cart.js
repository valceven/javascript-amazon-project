export let cart = JSON.parse(localStorage.getItem('cart')) || [
    {
        productId: "dd82ca78-a18b-4e2a-9250-31e67412f98d",
        quantity: 5,
        deliveryOptionsId: "1",
    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 5,
        deliveryOptionsId: "2",
    }
];

function saveToStorage() {
    localStorage.setItem('cart',JSON.stringify(cart));
}

export function handleAddToCart(button) {
    const { productId } = button.dataset;

    let matchingItem;

    cart.forEach(item => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    const quantitySelect = document.querySelector(`.js-select-quantity-${productId}`);
    const quantity = Number(quantitySelect.value);

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            deliveryOptionsId : "1",
        });
    }

    saveToStorage();
    updateCartQuantityDisplay();
    quantitySelect.value = 1;
    showAddedToCartMessage(productId);
}

export function updateCartQuantityDisplay() {
    let cartQuantity = 0;
    cart.forEach(item => {
        cartQuantity += item.quantity;
    });
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function showAddedToCartMessage(productId) {
    const added = document.querySelector(`.added-to-cart-${productId}`);
    added.style.opacity = 1;

    if (added.timeoutId) {
        clearTimeout(added.timeoutId);
    }

    added.timeoutId = setTimeout(() => {
        added.style.opacity = 0;
    }, 1000);
}


export function removeFromCart (param) {
    const tempCart = [];

    cart.forEach((cartItem) => { 
        if(cartItem.productId !== param) {
            tempCart.push(cartItem);
        }
    });
    
    cart = tempCart;
    saveToStorage();
};

export function updateDeliveryOption(productId, deliveryId) {
    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    matchingItem.deliveryOptionsId = deliveryId;
    saveToStorage();
}   


export function loadCart(fun) {
    const xhr = new XMLHttpRequest();
  
    xhr.addEventListener('load', () => {


      console.log(xhr.response);

      fun();
    });
  
   
  
    xhr.open('GET', 'https://supersimplebackend.dev/cart');
    xhr.send();
  }
