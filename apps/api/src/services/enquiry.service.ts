import type { ProductRepository } from "../repositories/product.repository.js";
import type { EnquiryInput, EnquiryMailer } from "../types/enquiry.js";

export class ProductNotFoundError extends Error {
  constructor() {
    super("Product was not found.");
    this.name = "ProductNotFoundError";
  }
}

export class EnquiryService {
  constructor(
    private readonly products: ProductRepository,
    private readonly mailer: EnquiryMailer
  ) {}

  async submit(input: EnquiryInput): Promise<void> {
    const product = await this.products.findById(input.productId);
    if (!product) throw new ProductNotFoundError();

    await this.mailer.sendEnquiry(input, product.title);
  }
}