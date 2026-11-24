import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  PRODUCTS_API_BASE_URL: z.string().url().default("https://fakestoreapi.com"),
  SALES_INBOX: z.string().email().default("sales@example.com"),
  EMAIL_FROM: z.string().email().default("catalogue@example.com"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_SECURE: z.string().default("false").transform((value) => value === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional()
});

export const env = envSchema.parse(process.env);
