
import apiClient from "../services/apiClient";
import type { Product } from "../types/Product";

const ENDPOINT = "/Products";

/**
 * Fetch a paginated list of products (optionally filtered by search).
 */
export async function getProducts(search?: string, page = 1, pageSize = 50) {
    const res = await apiClient.get<Product[]>(ENDPOINT, {
        params: { search, page, pageSize },
    });
    return res.data;
}

/**
 * Fetch a single product by ID.
 */
export async function getProduct(id: number): Promise<Product> {
    const res = await apiClient.get<Product>(`${ENDPOINT}/${id}`);
    return res.data;
}

/**
 * Create a new product.
 */
export async function createProduct(product: Omit<Product, "id">) {
    const res = await apiClient.post<Product>(ENDPOINT, product);
    return res.data;
}

/**
 * Update an existing product by ID.
 */
export async function updateProduct(id: number, product: Product) {
    await apiClient.put(`${ENDPOINT}/${id}`, product);
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id: number) {
    await apiClient.delete(`${ENDPOINT}/${id}`);
}

/**
 * Generate a description for a product by name.
 * Returns: { Message: string, aiDescription: string }
 */
export async function generateDescription(productName: string) {
    const res = await apiClient.post<{ Message: string; aiDescription: string }>(
        `${ENDPOINT}/${encodeURIComponent(productName)}/generate-description`
    );
    return res.data;
}
