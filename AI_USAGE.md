# AI usage and development notes

## Tools and model

- VS Code - development environment.
- ChatGPT (GPT-6) - architecture discussions, implementation support, debugging, test creation, and documentation.

I used AI as a development aid. I reviewed the generated output, made the implementation decisions, and remained responsible for validation and the final submission.

## AI-assisted development

I used AI assistance to scaffold the React/TypeScript and Node.js/Express project, discuss separation of concerns across controllers, services, repositories, and integrations, implement catalogue and enquiry workflows, create and review API tests, debug SMTP and TypeScript issues, and prepare the submission documentation.

## Key AI prompts and development moments (5)

These are concise reconstructions of five prompts or moments that shaped the implementation, based on the recorded iterations and current code. They are not verbatim chat transcripts:

1. "Build a small product-catalogue proof of concept with a React/TypeScript client and a Node/Express API. Use Fake Store API through the backend, show the five highest-rated products, support category browsing, search, product details, and product enquiries."
2. "Keep product access and enquiry email behind repository/provider interfaces. Validate requests on the server, return clear HTTP errors, and add tests for the main API behavior."
3. "Investigate `ECONNREFUSED ::1:1025` in the enquiry flow. Distinguish a host-run API from an API running in Docker Compose, and make the Mailpit SMTP and web UI endpoints work in each setup."
4. "Refine the catalogue UI: put search in the header, reduce oversized introductory content, keep a consistent light theme, and improve product-card hierarchy without removing catalogue features."
5. "Resolve the Express route-parameter TypeScript error using runtime type narrowing rather than an unsafe assertion, then check the build."

## AI-assisted issues and human-guided corrections

The first local Mailpit setup exposed its web UI on port `8025` but did not publish the SMTP port `1025`, so the host-run API could not connect and returned `ECONNREFUSED ::1:1025`. I corrected the Compose port mapping to publish both `1025:1025` for SMTP and `8025:8025` for the inbox UI. I also corrected the host distinction: host-run development connects to `127.0.0.1`, while the API running inside Compose connects to the `mailpit` service name. The current example environment and Compose configuration reflect these separate contexts. Mailpit only captures local test messages; this does not demonstrate delivery through a production SMTP provider.

I also fixed a TypeScript build issue caused by Express route parameters being typed as `string | string[]`; the category handler narrows the value at runtime instead of asserting a type.

For the UI, I asked to move search into the header, reduce oversized introductory content, and improve category discovery and product-card hierarchy. I explored dark and light theme support, then chose to remove dark mode and keep a consistent light theme. These iterations kept the main catalogue workflow while refining its layout and visual hierarchy.

## Review and validation responsibility

I reviewed AI-generated code and suggestions rather than treating them as authoritative. I made the architecture and scope decisions, checked the implementation against the acceptance paths, and ran the tests, type checks, and production builds listed below. I also reviewed the local enquiry workflow and Mailpit capture while keeping clear that local capture is not verification of real email delivery.

## Planning and specification

I did not create or commit a separate planning or specification document. I used the challenge brief to scope the work, and recorded implementation assumptions, scope decisions, trade-offs, and follow-up work in [DECISIONS.md](./DECISIONS.md). The prompt examples above are concise reconstructions, not verbatim chat logs.

## Agent instruction files

There are no repository-specific agent instruction files (for example, `AGENTS.md` or `.github/copilot-instructions.md`) in this submission. The AI prompts summarized above describe the guidance used during development; they are not committed agent configuration files.

## Validation

I ran these checks from the repository root:

- `npm test` - passed (3 test files, 10 tests).
- `npm run typecheck` - passed for the API and web client.
- `npm run build` - passed for the API and web client.

## Actual time spent

I spent approximately 3 hours on the challenge overall. The total is my estimate; I did not track a precise per-phase timer, so the breakdown below is approximate.

| Phase | Approximate time |
|---|---|
| Planning | 0.5 hour |
| Building | 1.5 hours |
| Testing | 0.5 hour |
| Reviewing | 0.5 hour |
| Total | 3 hours |
