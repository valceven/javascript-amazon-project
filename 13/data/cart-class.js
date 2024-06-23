class Cart {
    cartItems;
    localStorageKey;

    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
        this.loadFromStorage();
    }

    loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [
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
    };

    saveToStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
    };

    handleAddToCart(button) {
        const { productId } = button.dataset;
    
        let matchingItem;
    
        this.cartItems.forEach(item => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });
    
        const quantitySelect = document.querySelector(`.js-select-quantity-${productId}`);
        const quantity = Number(quantitySelect.value);
    
        if (matchingItem) {
            matchingItem.quantity += quantity;
        } else {
            this.cartItems.push({
                productId,
                quantity,
                deliveryOptionsId : "1",
            });
        }
    
        this.saveToStorage();
        this.updateCartQuantityDisplay();
        quantitySelect.value = 1;
        this.showAddedToCartMessage(productId);
    };

    updateCartQuantityDisplay() {
        let cartQuantity = 0;
        this.cartItems.forEach(item => {
            cartQuantity += item.quantity;
        });
        document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    };

    showAddedToCartMessage(productId) {
        const added = document.querySelector(`.added-to-cart-${productId}`);
        added.style.opacity = 1;

        if (added.timeoutId) {
            clearTimeout(added.timeoutId);
        }

        added.timeoutId = setTimeout(() => {
            added.style.opacity = 0;
        }, 1000);
    };

    removeFromCart(param) {
        const tempCart = [];
    
        this.cartItems.forEach((cartItem) => { 
            if(cartItem.productId !== param) {
                tempCart.push(cartItem);
            }
        });
        
        this.cartItems = tempCart;
        this.saveToStorage();
    };

    updateDeliveryOption(productId, deliveryId) {
        let matchingItem;

        this.cartItems.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });

        if (matchingItem) {
            matchingItem.deliveryOptionsId = deliveryId;
            this.saveToStorage();
        }
    };

}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

console.log(cart);
console.log(businessCart);
