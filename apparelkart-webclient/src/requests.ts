import type { Product, ProductApiResponse, ProductApiResponsePayload, ProductsApiResponse } from "./types";

// local dev
const API_PREFIX = "http://127.0.0.1:5000/api";
// production
// const API_PREFIX = "/api";

export async function getProducts(): Promise<Product[] | null> {
    try {
        const res = await fetch(`${API_PREFIX}/products`);
        if (!res.ok) throw new Error("Something went wrong");
        const json: ProductsApiResponse = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to fetch all products", err);
        return null;
    }
}

export async function getProduct(asinCode: string): Promise<ProductApiResponsePayload | null> {
    try {
        const res = await fetch(`${API_PREFIX}/product/${asinCode}`);
        if (!res.ok) throw new Error("Something went wrong");
        const json: ProductApiResponse = await res.json();
        return json.payload;
    } catch (err) {
        console.error(`Failed to fetch product with asin code ${asinCode}`, err);
        return null;
    }
}