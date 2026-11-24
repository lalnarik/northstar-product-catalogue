# Northstar Product Catalogue

A time-boxed product catalogue proof of concept built for the AI-Native Engineer challenge. It uses React and TypeScript for the web client and Node.js, Express, and TypeScript for the API.

## What is implemented

| Challenge path | Implementation |
|---|---|
| Discover products | Home page shows up to five products ranked by rating. |
| Browse categories | Category pages list products ranked by rating. |
| Search | Header search matches product title, description, or category without case sensitivity. |
| View a product | Product details are loaded from the API when a product is selected. |
| Send an enquiry | The API validates the enquiry, checks the product, and sends an email through SMTP. The UI shows a success message after the API accepts it. |

The browser only calls this project's API. The API's `ProductRepository` adapter calls Fake Store API; provider errors are returned as safe API errors. Enquiries are not stored in a database.

## Run locally

Prerequisites: Node.js 20+, npm 10+, and internet access for Fake Store API. Docker Desktop is optional if you use a separate SMTP server.

From the repository root:

1. Copy the example environment file:
   - PowerShell: `Copy-Item .env.example .env`
   - macOS/Linux: `cp .env.example .env`
2. Install dependencies: `npm install`
3. Start the local email inbox: `docker compose up mailpit -d`
4. Start the API and web client: `npm run dev`

Open:

- Web: http://localhost:5173
- API health: http://localhost:4000/api/health
- Mailpit inbox: http://localhost:8025

Mailpit captures enquiry messages locally; it does not deliver them to a real sales inbox. To run without Docker, configure a reachable SMTP server in `.env`. The API returns success after the SMTP server accepts a message, not after final inbox delivery.

Stop the local inbox with `docker compose stop mailpit`.

## Run with Docker Compose

`docker compose up --build`

Open the web app at http://localhost:5173, the API at http://localhost:4000, and Mailpit at http://localhost:8025. In this setup the API connects to the `mailpit` Compose service; host-run development instead connects to `127.0.0.1`.

## Commands

- `npm test` - API unit and integration tests
- `npm run typecheck` - TypeScript checks for the API and web client
- `npm run build` - production builds for the API and web client

The automated tests cover API health and error responses, product service behavior, and enquiry validation. There are no browser end-to-end tests or live SMTP-provider tests.

## API

All successful data responses use a `data` property. Errors use an `error` object.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | All products |
| GET | `/api/products/featured` | Up to five highest-rated products |
| GET | `/api/products/categories` | Product categories |
| GET | `/api/products/categories/:category` | Products in a category, sorted by rating |
| GET | `/api/products/search?q=term` | Search title, description, and category |
| GET | `/api/products/:id` | Product details |
| POST | `/api/enquiries` | Validate and send a product enquiry |

Example enquiry request:

```json
{
  "productId": 1,
  "name": "Alex Customer",
  "email": "alex@example.com",
  "phone": "+1 555 0100",
  "message": "Please share more details."
}
```

`name` and `email` are required. `phone` and `message` are optional.

## Configuration and email

`.env.example` contains local development settings. The local API uses Mailpit on `127.0.0.1:1025`; the Docker Compose API uses the `mailpit` service name. The web client uses `VITE_API_BASE_URL`.

For real email delivery, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, optional `SMTP_USER` and `SMTP_PASSWORD`, `EMAIL_FROM`, and `SALES_INBOX` with an approved provider. Do not commit `.env` or credentials. The example inbox and sender are placeholders.

## Architecture

- `ProductRepository` abstracts product data access; `FakeStoreProductRepository` is the current adapter.
- `ProductService` contains catalogue rules such as rating order and search.
- `EnquiryMailer` abstracts email delivery; `SmtpEnquiryMailer` uses configurable SMTP.
- Controllers validate HTTP input and translate outcomes into HTTP responses.
- The web client calls only the local API, not Fake Store API directly.

See [DECISIONS.md](./DECISIONS.md) for assumptions, trade-offs, and follow-up work, and [AI_USAGE.md](./AI_USAGE.md) for AI-use disclosure and development prompts.

## Scope and limitations

This is a local proof of concept, not a deployed or production-ready service. It has no database, catalogue administration, authentication, cart, checkout, enquiry persistence, email retry queue, or rate limiting. Product data depends on Fake Store API availability; no AWS infrastructure or deployment is included.
