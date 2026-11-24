import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { EnquiryService } from "../services/enquiry.service.js";
import { ProductNotFoundError } from "../services/enquiry.service.js";

const enquirySchema = z.object({
  productId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional()
});

export class EnquiryController {
  constructor(private readonly service: EnquiryService) {}

  submit = async (request: Request, response: Response, next: NextFunction) => {
    const parsed = enquirySchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Please provide a valid product, name and email address.",
          details: parsed.error.flatten().fieldErrors
        }
      });
      return;
    }

    try {
      await this.service.submit(parsed.data);
      response.status(201).json({
        data: { message: "Thank you. Your enquiry has been submitted." }
      });
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        response.status(404).json({
          error: { code: "PRODUCT_NOT_FOUND", message: error.message }
        });
        return;
      }
      next(error);
    }
  };
}