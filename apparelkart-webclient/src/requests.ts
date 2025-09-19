import type { Product, ProductApiResponse, ProductApiResponsePayload, ProductsApiResponse } from "./types";

// local dev (with cors)
// const API_PREFIX = "http://127.0.0.1:5000/api";
// production (no cors)
const API_PREFIX = "/api";

function toggleSpinner() {
    const overlay: HTMLDivElement | null = document.getElementById("loading-overlay") as HTMLDivElement;
    if (!overlay) return;
    overlay.classList.toggle("hidden");
}

export async function getProducts(): Promise<Product[] | null> {
    try {
        toggleSpinner();
        const res = await fetch(`${API_PREFIX}/products`);
        if (!res.ok) throw new Error("Something went wrong");
        const json: ProductsApiResponse = await res.json();
        toggleSpinner();
        return json.payload;
    } catch (err) {
        console.error("Failed to fetch all products", err);
        toggleSpinner();
        return null;
    }
}

export async function getProduct(asinCode: string): Promise<ProductApiResponsePayload | null> {
    try {
        toggleSpinner();
        const res = await fetch(`${API_PREFIX}/product/${asinCode}`);
        if (!res.ok) throw new Error("Something went wrong");
        const json: ProductApiResponse = await res.json();
        toggleSpinner();
        return json.payload;
    } catch (err) {
        console.error(`Failed to fetch product with asin code ${asinCode}`, err);
        toggleSpinner();
        return null;
    }
}