import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import type { ProductService } from "../services/product.service.js";

export function createProductRouter(service: ProductService): Router {
  const router = Router();
  const controller = new ProductController(service);

  router.get("/", controller.getAll);
  router.get("/featured", controller.getFeatured);
  router.get("/categories", controller.getCategories);
  router.get("/categories/:category", controller.getByCategory);
  router.get("/search", controller.search);
  router.get("/:id", controller.getById);

  return router;
}