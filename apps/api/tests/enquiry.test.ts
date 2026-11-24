import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import type { ProductRepository } from "../src/repositories/product.repository.js";
import type { EnquiryMailer } from "../src/types/enquiry.js";
import type { Product } from "../src/types/product.js";

const product: Product = {
  id: 7,
  title: "Test product",
  price: 12,
  description: "A test product",
  category: "test",
  image: "",
  rating: { rate: 4.5, count: 10 }
};

function dependencies(productExists = true) {
  const repository: ProductRepository = {
    findAll: vi.fn().mockResolvedValue([product]),
    findById: vi.fn().mockResolvedValue(productExists ? product : null),
    findByCategory: vi.fn().mockResolvedValue([product]),
    findCategories: vi.fn().mockResolvedValue(["test"])
  };
  const mailer: EnquiryMailer = {
    sendEnquiry: vi.fn().mockResolvedValue(undefined)
  };
  return { repository, mailer, app: createApp({ productRepository: repository, enquiryMailer: mailer }) };
}

describe("POST /api/enquiries", () => {
  it("validates input and sends an enquiry for a real product", async () => {
    const deps = dependencies();
    const response = await request(deps.app).post("/api/enquiries").send({
      productId: 7,
      name: "Kiran Customer",
      email: "customer@example.com",
      phone: "+91 9000000000",
      message: "Please share availability."
    });

    expect(response.status).toBe(201);
    expect(response.body.data.message).toContain("Thank you");
    expect(deps.mailer.sendEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 7, email: "customer@example.com" }),
      "Test product"
    );
  });

  it("rejects invalid customer details", async () => {
    const deps = dependencies();
    const response = await request(deps.app).post("/api/enquiries").send({
      productId: 7,
      name: "K",
      email: "not-an-email"
    });

    expect(response.status).toBe(400);
    expect(deps.mailer.sendEnquiry).not.toHaveBeenCalled();
  });

  it("returns 404 when the product does not exist", async () => {
    const deps = dependencies(false);
    const response = await request(deps.app).post("/api/enquiries").send({
      productId: 999,
      name: "Kiran Customer",
      email: "customer@example.com"
    });

    expect(response.status).toBe(404);
    expect(deps.mailer.sendEnquiry).not.toHaveBeenCalled();
  });
});