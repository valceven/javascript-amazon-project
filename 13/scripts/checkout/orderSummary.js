import { Cart } from "../../data/cart-class.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/delivery-options.js";
import { renderCartProducts } from "../../data/products.js";
import { getDeliveryOption } from "../../data/delivery-options.js";
import { renderPaymentSummary } from "./paymentSummary.js";

const today = dayjs();
const deliveryDate = today.add(7, 'days');
const cart = new Cart('cart-oop');

export function renderOrderSummary() {

    document.querySelector('.js-order-summary').innerHTML = "";
    
    let cartSummmaryHTML = "";

    cart.cartItems.forEach((cartItem) => {
        console.log(cartItem);

        const productId = cartItem.productId;
        const matchingProduct = renderCartProducts(productId);

        checkout();

        const { deliveryOptionsId } = cartItem;
        const deliveryFinal = getDeliveryOption(deliveryOptionsId);
        console.log(deliveryFinal);

        const deliveryDate = today.add(1, 'days');
        const dateString = deliveryDate.format("dddd ");

        cartSummmaryHTML +=
            `<div class="cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">Delivery date: ${dateString}</div>
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}" />
                    <div class="cart-item-details">
                        <div class="product-name">${matchingProduct.name}</div>
                        <div class="product-price">${matchingProduct.getPrice()}</div>
                        <div class="product-quantity">
                            <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
                            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>
                            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="delivery-options-title">Choose a delivery option:</div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>`
    });

    document.querySelector('.js-order-summary').innerHTML += cartSummmaryHTML;

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const { productId } = link.dataset;
            cart.removeFromCart(productId);
            const toRemove = document.querySelector(`.cart-item-container-${productId}`);
            if (toRemove) {
                toRemove.remove();
            }
            renderPaymentSummary();
            checkout();
        });
    });

    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const { productId } = link.dataset;
            console.log(productId);
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const { productId, deliveryOptionId } = element.dataset;
            cart.updateDeliveryOption(productId, deliveryOptionId);
            renderPaymentSummary();
            renderOrderSummary();
        });
    });

    function checkout() {
        const checkouts = document.querySelector('.js-checkout');
        if (checkouts) {
            checkouts.innerHTML = cart.cartItems.length > 0 ? `${cart.cartItems.length} items` : `No items`;
        }
    }

    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = "";
        deliveryOptions.forEach((delivery) => {
            const deliveryDate = today.add(delivery.deliveryDays, 'days');
            const dateString = deliveryDate.format("dddd, MMMM D");
            const priceString = delivery.priceCents === 0 ? "FREE" : `$${formatCurrency(delivery.priceCents)} - `;
            const isChecked = delivery.id === cartItem.deliveryOptionsId;
            html +=
                `<div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${delivery.id}">
                    <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}" />
                    <div>
                        <div class="delivery-option-date">${dateString}</div>
                        <div class="delivery-option-price">${priceString} Shipping</div>
                    </div>
                </div>`;
        });
        return html;
    }
}
