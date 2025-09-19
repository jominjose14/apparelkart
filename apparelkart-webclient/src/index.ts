import './style.css';
import { getProducts } from './requests';
import type { Product } from './types';

// state
let products: Product[] = [];

document.addEventListener("DOMContentLoaded", () => {
    populateDummyProducts();
    const searchInput: HTMLInputElement | null = document.getElementById("product-search-input") as HTMLInputElement;
    if (searchInput) searchInput.addEventListener('input', onSearchInputChange);
    onSearchInputChange();
});

document.addEventListener("DOMContentLoaded", async () => {
    const fetchedProducts: Product[] | null = await getProducts();
    if (fetchedProducts === null) return;
    products = fetchedProducts;
    onSearchInputChange();
});

function populateDummyProducts() {
    const dummyProducts: Product[] = [];
    for (let i = 1; i <= 50; i++) {
        const dummyProduct: Product = {
            asin: "B0759XSMDG",
            brand: "Vogue",
            color: "Magenta",
            formatted_price: "$49.99",
            medium_image_url: "favicon.svg",
            product_type_name: "Shirt",
            title: `Product ${i}`,
        };
        dummyProducts.push(dummyProduct);
    }
    products = dummyProducts;
}

function renderProducts(products: Product[]) {
    const productGrid: HTMLDivElement | null = document.getElementById("product-grid") as HTMLDivElement;
    const productTemplate: HTMLTemplateElement | null = document.getElementById("product-card-template") as HTMLTemplateElement;

    productGrid.innerHTML = "";
    for (const product of products) {
        const productCard: HTMLAnchorElement | null = productTemplate.content.querySelector(".product-card")!.cloneNode(true) as HTMLAnchorElement;
        productCard.href = `product.html?asin=${product.asin}`;
        productCard.querySelector("img")!.src = product.medium_image_url;
        productCard.querySelector("p")!.textContent = product.title;
        productGrid.appendChild(productCard);
    }
}

function onSearchInputChange() {
    const searchInput: HTMLInputElement | null = document.getElementById("product-search-input") as HTMLInputElement;
    const searchText: string = searchInput.value;
    let filteredProducts = [];
    if (searchText === "") {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchText.toLowerCase()));
    }
    renderProducts(filteredProducts);
}