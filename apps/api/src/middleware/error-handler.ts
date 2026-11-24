import type { ErrorRequestHandler } from "express";
import { ProductDataSourceError } from "../repositories/fake-store-product.repository.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ProductDataSourceError) {
    response.status(502).json({
      error: {
        code: "PRODUCT_PROVIDER_ERROR",
        message: "Product data is temporarily unavailable. Please try again."
      }
    });
    return;
  }

  console.error("Unhandled request error:", error);
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred."
    }
  });
};