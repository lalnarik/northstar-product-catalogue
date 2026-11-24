import type { Product } from "../types/product.js";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  findCategories(): Promise<string[]>;
}