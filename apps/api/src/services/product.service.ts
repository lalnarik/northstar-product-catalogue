import type { ProductRepository } from "../repositories/product.repository.js";
import type { Product } from "../types/product.js";

const FEATURED_PRODUCT_COUNT = 5;

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.repository.findAll();
    return this.sortByRating(products).slice(0, FEATURED_PRODUCT_COUNT);
  }

  async getCategories(): Promise<string[]> {
    return this.repository.findCategories();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.repository.findByCategory(category);
    return this.sortByRating(products);
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return [];

    const products = await this.repository.findAll();
    return products.filter((product) =>
      [product.title, product.description, product.category]
        .some((field) => field.toLocaleLowerCase().includes(normalizedQuery))
    );
  }

  private sortByRating(products: Product[]): Product[] {
    return [...products].sort((a, b) =>
      b.rating.rate - a.rating.rate ||
      b.rating.count - a.rating.count
    );
  }
}