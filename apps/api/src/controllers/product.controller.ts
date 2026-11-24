import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { ProductService } from "../services/product.service.js";

const idSchema = z.coerce.number().int().positive();

export class ProductController {
  constructor(private readonly service: ProductService) {}

  getAll = async (_request: Request, response: Response, next: NextFunction) => {
    try {
      response.json({ data: await this.service.getAllProducts() });
    } catch (error) {
      next(error);
    }
  };

  getFeatured = async (_request: Request, response: Response, next: NextFunction) => {
    try {
      response.json({ data: await this.service.getFeaturedProducts() });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (_request: Request, response: Response, next: NextFunction) => {
    try {
      response.json({ data: await this.service.getCategories() });
    } catch (error) {
      next(error);
    }
  };

  getByCategory = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categoryParam = request.params.category;
      const category = typeof categoryParam === "string" ? categoryParam.trim() : "";
      if (!category) {
        response.status(400).json({
          error: { code: "INVALID_CATEGORY", message: "Category is required." }
        });
        return;
      }
      response.json({ data: await this.service.getProductsByCategory(category) });
    } catch (error) {
      next(error);
    }
  };

  search = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const query = z.string().trim().min(1).max(100).safeParse(request.query.q);
      if (!query.success) {
        response.status(400).json({
          error: {
            code: "INVALID_SEARCH_QUERY",
            message: "Query parameter 'q' must contain 1–100 characters."
          }
        });
        return;
      }
      response.json({ data: await this.service.searchProducts(query.data) });
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsedId = idSchema.safeParse(request.params.id);
      if (!parsedId.success) {
        response.status(400).json({
          error: { code: "INVALID_PRODUCT_ID", message: "Product ID must be a positive integer." }
        });
        return;
      }

      const product = await this.service.getProductById(parsedId.data);
      if (!product) {
        response.status(404).json({
          error: { code: "PRODUCT_NOT_FOUND", message: "Product was not found." }
        });
        return;
      }
      response.json({ data: product });
    } catch (error) {
      next(error);
    }
  };
}