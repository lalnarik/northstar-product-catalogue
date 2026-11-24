# Product Catalogue

A product catalogue proof of concept built with React, TypeScript, Node.js and Express.

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- Docker Desktop (optional, for local email capture)

## Run locally

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Start local email capture with `docker compose up mailpit -d` (recommended).
4. Run `npm run dev`.

Open:
- Web: http://localhost:5173
- API health: http://localhost:4000/api/health
- Mailpit inbox: http://localhost:8025

Without Docker/Mailpit, the catalogue APIs still run, but submitting an enquiry requires a reachable SMTP server configured in `.env`.

## Run with Docker

`docker compose up --build`

Open the web app at http://localhost:5173, API at http://localhost:4000 and local email inbox at http://localhost:8025.

## Commands

- `npm test` — API unit and integration tests
- `npm run typecheck` — TypeScript checks
- `npm run build` — production builds

## Features

- Home page with five highest-rated products.
- Category browsing and rating sort.
- Case-insensitive search across product title, description and category.
- Product details page.
- Product enquiry form with server-side validation.
- Enquiry email delivery through configurable SMTP.

## Email configuration

The application uses SMTP through Nodemailer. The default local configuration targets Mailpit, which captures outgoing messages for development without sending external email or requiring a paid account.

Mailpit is a local development inbox, not a real sales mailbox. For a real deployment, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, optional `SMTP_USER` and `SMTP_PASSWORD`, `EMAIL_FROM`, and `SALES_INBOX` with an approved SMTP provider. Do not commit credentials. A successful API response means the SMTP server accepted the message; it does not guarantee final inbox delivery.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | All products |
| GET | `/api/products/featured` | Five highest-rated products |
| GET | `/api/products/categories` | Categories |
| GET | `/api/products/categories/:category` | Category products |
| GET | `/api/products/search?q=term` | Search products |
| GET | `/api/products/:id` | Product details |
| POST | `/api/enquiries` | Validate and send an enquiry |

### Enquiry request

```json
{
  "productId": 1,
  "name": "Alex Customer",
  "email": "alex@example.com",
  "phone": "+1 555 0100",
  "message": "Please share more details."
}
```

## Architecture

- `ProductRepository` abstracts product data access.
- `FakeStoreProductRepository` is the current product provider adapter.
- `ProductService` contains catalogue business rules.
- `EnquiryMailer` abstracts email delivery.
- `SmtpEnquiryMailer` sends email through configurable SMTP.
- Controllers validate HTTP input and translate outcomes into HTTP responses.

The browser communicates only with our backend; it never calls Fake Store API directly.
