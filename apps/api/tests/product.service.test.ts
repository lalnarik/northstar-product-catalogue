import { describe, expect, it, vi } from "vitest";
import { ProductService } from "../src/services/product.service.js";
import type { ProductRepository } from "../src/repositories/product.repository.js";
import type { Product } from "../src/types/product.js";

const products: Product[] = [
  { id: 1, title: "Alpha", price: 10, description: "Cotton shirt", category: "clothing", image: "", rating: { rate: 3.5, count: 10 } },
  { id: 2, title: "Beta", price: 20, description: "Leather wallet", category: "accessories", image: "", rating: { rate: 4.8, count: 20 } },
  { id: 3, title: "Gamma", price: 30, description: "Cotton jacket", category: "clothing", image: "", rating: { rate: 4.8, count: 30 } },
  { id: 4, title: "Delta", price: 40, description: "Metal bottle", category: "home", image: "", rating: { rate: 2.1, count: 5 } },
  { id: 5, title: "Epsilon", price: 50, description: "Cotton socks", category: "clothing", image: "", rating: { rate: 4.1, count: 8 } },
  { id: 6, title: "Zeta", price: 60, description: "Cotton cap", category: "clothing", image: "", rating: { rate: 4.0, count: 7 } }
];

function createRepository(): ProductRepository {
  return {
    findAll: vi.fn().mockResolvedValue(products),
    findById: vi.fn(async (id: number) => products.find((p) => p.id === id) ?? null),
    findByCategory: vi.fn(async (category: string) => products.filter((p) => p.category === category)),
    findCategories: vi.fn().mockResolvedValue(["clothing", "accessories", "home"])
  };
}

describe("ProductService", () => {
  it("returns the five highest-rated products, breaking ties by rating count", async () => {
    const service = new ProductService(createRepository());
    const result = await service.getFeaturedProducts();

    expect(result).toHaveLength(5);
    expect(result.map((p) => p.id)).toEqual([3, 2, 5, 6, 1]);
  });

  it("searches title, description and category case-insensitively", async () => {
    const service = new ProductService(createRepository());
    const result = await service.searchProducts("COTTON");

    expect(result.map((p) => p.id)).toEqual([1, 3, 5, 6]);
  });

  it("returns an empty list for a blank search", async () => {
    const repository = createRepository();
    const service = new ProductService(repository);

    await expect(service.searchProducts("  ")).resolves.toEqual([]);
    expect(repository.findAll).not.toHaveBeenCalled();
  });

  it("sorts category products by rating", async () => {
    const service = new ProductService(createRepository());
    const result = await service.getProductsByCategory("clothing");

    expect(result.map((p) => p.id)).toEqual([3, 5, 6, 1]);
  });

  it("returns null when a product does not exist", async () => {
    const service = new ProductService(createRepository());
    await expect(service.getProductById(999)).resolves.toBeNull();
  });
});