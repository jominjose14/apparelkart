import './style.css';
import { getProduct } from './requests';
import type { ProductApiResponsePayload } from './types';

document.addEventListener("DOMContentLoaded", () => {
    renderDummyProducts();
    fetchProduct();
});

function renderDummyProducts() {
    const productGrid: HTMLDivElement | null = document.getElementById("product-grid") as HTMLDivElement;
    const productTemplate: HTMLTemplateElement | null = document.getElementById("product-card-template") as HTMLTemplateElement;
    for (let i = 1; i <= 5; i++) {
        const productCard: HTMLDivElement | null = productTemplate.content.querySelector(".product-card")!.cloneNode(true) as HTMLDivElement;
        productCard.querySelector("img")!.src = "favicon.svg";
        productCard.querySelector("p")!.textContent = `Product ${i}`;
        productGrid.appendChild(productCard);
    }
}

async function fetchProduct() {
    const queryString: string = document.location.search;
    const urlParams = new URLSearchParams(queryString);
    const asinCode: string | null = urlParams.get('asin');
    if (asinCode === null) {
        console.error("Failed to load page's main product. Caused by: product asin code not found in url");
        return;
    }
    const payload: ProductApiResponsePayload | null = await getProduct(asinCode);
    if (payload === null) {
        console.error("Failed to load page's main product. Caused by: network fetch failed");
        return;
    }

    const fetchedProduct = payload.product;
    const mainProduct: HTMLDivElement | null = document.querySelector(".main-product") as HTMLDivElement;

    const image: HTMLImageElement | null = mainProduct.querySelector("img");
    if (image) image.src = fetchedProduct.medium_image_url;

    const name: HTMLParagraphElement | null = mainProduct.querySelector(".product-name");
    if (name) name.textContent = fetchedProduct.title;

    const price: HTMLParagraphElement | null = mainProduct.querySelector(".product-price");
    if (price) price.textContent = fetchedProduct.formatted_price;

    const asin: HTMLParagraphElement | null = mainProduct.querySelector(".product-asin");
    if (asin) asin.textContent = fetchedProduct.asin;

    const brand: HTMLParagraphElement | null = mainProduct.querySelector(".product-brand");
    if (brand) brand.textContent = fetchedProduct.brand;

    const color: HTMLParagraphElement | null = mainProduct.querySelector(".product-color");
    if (color) color.textContent = fetchedProduct.color;

    const recommendedProducts = payload.recommendations;

    // render recommended products
    const productGrid: HTMLDivElement | null = document.getElementById("product-grid") as HTMLDivElement;
    const productTemplate: HTMLTemplateElement | null = document.getElementById("product-card-template") as HTMLTemplateElement;

    productGrid.innerHTML = "";
    for (const product of recommendedProducts) {
        const productCard: HTMLAnchorElement | null = productTemplate.content.querySelector(".product-card")!.cloneNode(true) as HTMLAnchorElement;
        productCard.href = `product.html?asin=${product.asin}`;
        productCard.querySelector("img")!.src = product.medium_image_url;
        productCard.querySelector("p")!.textContent = product.title;
        productGrid.appendChild(productCard);
    }
}