export interface ProductsApiResponse {
    success: boolean,
    message: string,
    payload: Product[],
}

export interface ProductApiResponse {
    success: boolean,
    message: string,
    payload: ProductApiResponsePayload,
}

export interface ProductApiResponsePayload {
    product: Product,
    recommendations: Product[],
}

export interface Product {
    asin: string,
    brand: string,
    color: string,
    formatted_price: string,
    medium_image_url: string,
    product_type_name: string,
    title: string,
}