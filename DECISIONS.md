# Decisions and assumptions

## Technology and architecture

- React + TypeScript web client and Node.js + Express + TypeScript backend.
- The browser never calls Fake Store API directly.
- Product access is behind `ProductRepository`; the current adapter uses Fake Store API.
- Enquiry email delivery is behind `EnquiryMailer`; the current adapter uses SMTP.
- No database is introduced because product metadata is explicitly unimportant for this proof of concept.

## Product behaviour assumptions

- "Top rated" means descending `rating.rate`; ties are broken by descending `rating.count`.
- The home page shows the five highest-rated products across the catalogue.
- Category pages show products in that category sorted by rating.
- Search is case-insensitive substring matching across title, description and category.
- Provider failures return a safe HTTP 502 response.

## Enquiry behaviour assumptions

- Name and email are required; phone and message are optional.
- Enquiries are associated with a product ID and the backend resolves the product title before sending.
- The sales inbox is configurable via `SALES_INBOX`.
- SMTP is the email transport abstraction. Mailpit is used for local development to capture messages without a paid account.
- In local development, captured Mailpit messages are not delivered to a real sales inbox. A real SMTP provider must be configured for real delivery.
- A successful response indicates SMTP accepted the message, not guaranteed final inbox delivery.

## Trade-offs and next steps

- No authentication, admin catalogue management, persistent enquiry database, rate limiting, or production email retry queue is included in this time-boxed PoC.
- Before production: add abuse protection/rate limiting, durable enquiry storage, retry/observability for email delivery, accessibility review, and deployment-specific secrets management.
