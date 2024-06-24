import { formatCurrency } from "../scripts/utils/money.js";

class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  };

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  };

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  };

  extraInfoHTML(){
    return '';
  };
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    ({ sizeChartLink: this.sizeChartLink } = productDetails);
  };

  

   extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">Size Chart</a>
    `;
   }
}



const tshirt = new Clothing({
  id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
  image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
  name: "Adults Plain Cotton T-Shirt - 2 Pack",
  rating: {
    stars: 4.5,
    count: 56
  },
  priceCents: 799,
  keywords: [
    "tshirts",
    "apparel",
    "mens"
  ],
  type: "clothing",
  sizeChartLink: "images/clothing-size-chart.png"
});

export let products = [];

export function loadProducts(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        products = JSON.parse(xhr.response).map(productDetails => {
          if (productDetails.type === 'clothing') {
            return new Clothing(productDetails);
          }
          return new Product(productDetails);
        });
        console.log("Products loaded:", products);
        fun();
      } catch (error) {
        console.error("Error parsing products:", error);
      }
    } else {
      console.error(`Failed to load products. Status: ${xhr.status}`);
    }
  });

  xhr.addEventListener('error', () => {
    console.error('Failed to make request to load products.');
  });

  xhr.open('GET', 'https://supersimplebackend.dev/products');
  xhr.send();
}

export function renderCartProducts(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
        matchingProduct = product;
    }
  });

  return matchingProduct;
}