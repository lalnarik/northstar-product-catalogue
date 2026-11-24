# Decisions and assumptions

## Scope and acceptance assumptions

- "Top rated" means descending `rating.rate`; ties are broken by descending `rating.count`.
- The home page requests at most five products. If the provider returns fewer than five, the UI shows the available products.
- Category results use the same rating order.
- Search is a trimmed, case-insensitive substring match across title, description, and category. A blank API search is rejected; a search with no matches returns an empty list.
- Product and category data come from Fake Store API. A local product database is unnecessary for this proof of concept: catalogue data is read-only and provider-owned, the app has no product administration or mutations, and the acceptance flow does not require offline catalogue access. Enquiries are sent by email and are not required to be retained by the challenge.
- An enquiry requires a valid product, name, and email. Phone and message are optional. Success means the SMTP server accepted the email, not that it reached the recipient's inbox.

## Architecture decisions

- React and TypeScript provide the web client; Node.js, Express, and TypeScript provide the API.
- The browser calls the API only. `ProductRepository` isolates the Fake Store API integration, leaving room for a different product source without coupling the UI to it.
- `ProductService` owns catalogue behavior; controllers validate and translate HTTP requests and responses.
- `EnquiryMailer` isolates SMTP delivery. Mailpit is the local development inbox, while production email-provider configuration is supplied through environment variables.
- No cloud infrastructure is included. Docker Compose is a local development option, not an AWS deployment.

## Explicit scope decisions

| Area | In scope for this submission | Deliberately out of scope | Why it was simplified or dropped |
|---|---|---|---|
| Client and server | React/TypeScript web client and Node.js/Express/TypeScript API | A native mobile app or a second backend stack | The challenge asks for a small web proof of concept and permits a single client/backend choice. |
| Product catalogue | Fake Store API integration, featured products, categories, search, and product details | Local product database, catalogue administration, and product mutations | The provider supplies the read-only catalogue; managing or editing products is not part of the acceptance flow. |
| Enquiries | Server-side validation and SMTP delivery, with Mailpit for local capture | Enquiry persistence, authentication, email retries, and a production sales system | The required path is to submit an enquiry and send it to sales; account management, audit history, and durable delivery require additional product requirements and infrastructure. |
| Operations | Local development and optional Docker Compose | AWS/cloud deployment, production monitoring, and managed infrastructure | The exercise requires a reviewer-friendly local run path, not cloud provisioning; deployment also needs environment-specific security and operational decisions. |
| Other commerce features | Product discovery and enquiry flow only | Cart, checkout, pagination, and rate limiting | These are outside the stated discovery/enquiry workflow; abuse protection and scale controls should be added before public production use. |

These boundaries keep the implementation centered on the challenge's catalogue and enquiry acceptance paths while making the data-source and email-transport choices replaceable. The database decision is specific to this scope, not a claim that catalogue or enquiry data never needs persistence in a production product.

## Known gaps and follow-up

- Product responses are parsed as JSON and typed in TypeScript, but their runtime shape is not schema-validated. Add provider-boundary validation before relying on this integration in production.
- Product data depends on the external provider. The API has a request timeout and returns provider errors, but no cache, retry policy, or local fallback.
- Enquiries are sent by SMTP only; there is no durable record or retry path if delivery fails.
- Automated coverage is API-focused. Add browser workflow, accessibility, provider-contract, and real SMTP integration checks before a production release.
- Add abuse protection, durable enquiry storage, monitoring, and deployment-specific secret management before exposing the service publicly.

## Future extensibility

The current abstractions give specific extension points without requiring a redesign:

- Replace `FakeStoreProductRepository` with a database-backed repository while keeping catalogue rules in `ProductService` and the browser-facing API stable.
- Add runtime response validation, caching, and provider health metrics inside the product integration boundary.
- Add a persistent enquiry repository behind `EnquiryService`, then dispatch notifications to a durable queue through a new mailer/notification adapter.
- Add authentication and rate limiting at the API boundary if catalogue management or public enquiry traffic requires them.
- Add deployment-specific configuration and monitoring when moving from local Compose to a cloud environment.

## One-day improvement plan

If one additional engineering day were available, I would prioritize this sequence (8 focused hours; not part of the current submission):

| Order | Time | Improvement | Completion evidence |
|---|---:|---|---|
| 1 | 2 hours | Add runtime schema validation for product-provider responses and tests for malformed or incomplete provider data. | Invalid provider payloads fail with a controlled API error; valid payloads still map to products. |
| 2 | 2 hours | Add browser-level tests for discover, category, search, product details, and enquiry validation/success. | Automated end-to-end checks cover the primary user paths. |
| 3 | 1.5 hours | Add accessible labels, keyboard-flow checks, and responsive-layout review for the catalogue and enquiry form. | Documented accessibility issues are fixed and critical controls work without a mouse. |
| 4 | 1.5 hours | Add abuse protection and durable enquiry storage, with tests for rejected bursts and persisted submissions. | Enquiries are retained, and excessive submissions are rejected safely. |
| 5 | 1 hour | Document and verify a reproducible deployment configuration, secrets handling, and health/operational checks. | A clean deployment walkthrough and a deployment smoke check are recorded. |

This order addresses data-boundary correctness and user-path confidence first; production deployment remains last because it depends on deciding and implementing persistence, abuse protection, and operational requirements.
