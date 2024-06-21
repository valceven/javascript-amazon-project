import { cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/delivery-options.js";

const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

let cartSummmaryHTML = "";

cart.forEach((cartItem) => {

    const { productId } = cartItem;

    checkout();

    let matchingProduct;

    products.forEach((product) => {
        if(product.id === productId) {
            matchingProduct = product;
        }
    }); 

    const { deliveryOptionsId } = cartItem;

    let deliveryFinal;
    
    deliveryOptions.forEach((option) => {
        if(option.id === deliveryOptionsId) {
            deliveryFinal = option;
        }
    });

    const today = dayjs();
    
    const deliveryDate = today.add(deliveryFinal.deliveryDays, 'days');
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummmaryHTML += 
    `<div class="cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: ${dateString}</div>

        <div class="cart-item-details-grid">
            <img
            class="product-image"
            src="${matchingProduct.image}"/>

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
                <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
                <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
        </div>
        </div>`

});

document.querySelector('.js-order-summary').innerHTML += cartSummmaryHTML;


document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
    link.addEventListener('click', () => {
        const { productId } = link.dataset;
        removeFromCart(productId);
        const toRemove = document.querySelector(`.cart-item-container-${productId}`);
        toRemove.remove();
        checkout();
    });
});

export function checkout() {
    const checkouts = document.querySelector('.js-checkout');
    checkouts.innerHTML = cart.length > 0 ? `${cart.length} items` : `No items`;
}

document.querySelectorAll('.js-update-link')
    .forEach((link) => {
        link.addEventListener(('click'), () => {
            const { productId } = link.dataset;
            console.log(productId);
        })
    });

function deliveryOptionsHTML (matchingProduct, cartItem) {

    let html =  "";

    deliveryOptions.forEach((delivery) => {
        const today = dayjs();
        const deliveryDate = today.add(delivery.deliveryDays, 'days');
        const dateString = deliveryDate.format("dddd, MMMM D");
        const priceString = delivery.priceCents === 0 ? "FREE" : `$${formatCurrency(delivery.priceCents)} - `

        const isChecked = delivery.id === cartItem.deliveryOptionsId;
        html +=
       `<div class="delivery-option">
            <input
            type="radio"
            ${isChecked ? 'checked': ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
            />
            <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
            </div>
        </div>`
    });

    return html;
}
