import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { FakeStoreProductRepository } from "./repositories/fake-store-product.repository.js";
import type { ProductRepository } from "./repositories/product.repository.js";
import { ProductService } from "./services/product.service.js";
import { createProductRouter } from "./routes/product.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { SmtpEnquiryMailer } from "./providers/smtp-enquiry.mailer.js";
import type { EnquiryMailer } from "./types/enquiry.js";
import { EnquiryService } from "./services/enquiry.service.js";
import { createEnquiryRouter } from "./routes/enquiry.routes.js";

interface AppDependencies {
  productRepository?: ProductRepository;
  enquiryMailer?: EnquiryMailer;
}

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();

  app.use(cors({ origin: env.CLIENT_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "product-catalogue-api"
    });
  });

  const productRepository =
    dependencies.productRepository ?? new FakeStoreProductRepository();
  const productService = new ProductService(productRepository);
  const enquiryMailer = dependencies.enquiryMailer ?? new SmtpEnquiryMailer();
  const enquiryService = new EnquiryService(productRepository, enquiryMailer);

  app.use("/api/products", createProductRouter(productService));
  app.use("/api/enquiries", createEnquiryRouter(enquiryService));
  app.use(errorHandler);

  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "The requested resource was not found."
      }
    });
  });

  return app;
}

export const app = createApp();