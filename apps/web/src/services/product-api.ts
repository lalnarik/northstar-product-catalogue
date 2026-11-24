import type { ApiResponse, Product } from "../types/product";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      payload?.error?.message ?? `Request failed with status ${response.status}`
    );
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export const productApi = {
  getFeatured: () => request<Product[]>("/products/featured"),
  getCategories: () => request<string[]>("/products/categories"),
  getAll: () => request<Product[]>("/products"),
  getByCategory: (category: string) =>
    request<Product[]>(`/products/categories/${encodeURIComponent(category)}`),
  search: (query: string) =>
    request<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
  getById: (id: number) => request<Product>(`/products/${id}`)
};