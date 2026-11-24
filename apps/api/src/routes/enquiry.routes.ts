import { Router } from "express";
import { EnquiryController } from "../controllers/enquiry.controller.js";
import type { EnquiryService } from "../services/enquiry.service.js";

export function createEnquiryRouter(service: EnquiryService): Router {
  const router = Router();
  const controller = new EnquiryController(service);
  router.post("/", controller.submit);
  return router;
}