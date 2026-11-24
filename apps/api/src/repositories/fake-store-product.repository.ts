import { env } from "../config/env.js";
import type { ProductRepository } from "./product.repository.js";
import type { Product } from "../types/product.js";

export class ProductDataSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductDataSourceError";
  }
}

export class FakeStoreProductRepository implements ProductRepository {
  private readonly baseUrl = env.PRODUCTS_API_BASE_URL.replace(/\/$/, "");

  private async get<T>(path: string): Promise<T> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        signal: AbortSignal.timeout(5_000),
        headers: { Accept: "application/json" }
      });
    } catch {
      throw new ProductDataSourceError("Product provider is unavailable.");
    }

    if (!response.ok) {
      throw new ProductDataSourceError(
        `Product provider returned status ${response.status}.`
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ProductDataSourceError("Product provider returned invalid data.");
    }
  }

  findAll(): Promise<Product[]> {
    return this.get<Product[]>("/products");
  }

  async findById(id: number): Promise<Product | null> {
    try {
      return await this.get<Product>(`/products/${id}`);
    } catch (error) {
      if (error instanceof ProductDataSourceError &&
          error.message.includes("status 404")) {
        return null;
      }
      throw error;
    }
  }

  findByCategory(category: string): Promise<Product[]> {
    return this.get<Product[]>(
      `/products/category/${encodeURIComponent(category)}`
    );
  }

  findCategories(): Promise<string[]> {
    return this.get<string[]>("/products/categories");
  }
}