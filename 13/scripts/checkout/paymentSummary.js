import { Cart } from "../../data/cart-class.js";
import { renderCartProducts } from "../../data/products.js";
import { getDeliveryOption } from "../../data/delivery-options.js";
import { formatCurrency } from "../utils/money.js"; 

const cart = new Cart('cart-oop'); 

export function renderPaymentSummary() {

    document.querySelector('.js-payment-summary').innerHTML = "";


    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let totalItems = 0;
    
    cart.cartItems.forEach((cartItem) => {
        const product = renderCartProducts(cartItem.productId); 
        productPriceCents += product.priceCents * cartItem.quantity;
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionsId);
        shippingPriceCents += deliveryOption.priceCents;
        totalItems += cartItem.quantity;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    
    const taxCents = totalBeforeTaxCents * .1;

    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = 
        `
        <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
          <div>Items (${totalItems}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
        `

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}

