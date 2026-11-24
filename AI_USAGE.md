# AI Usage Notes

## Tools and Models

- VS Code – Development environment.
- ChatGPT (GPT-6) – AI-assisted development, architecture discussions, implementation support, debugging, and documentation.

## AI-Assisted Development

AI assistance was used throughout the development process for:

- Generating the initial project structure using React, TypeScript, Node.js, and Express.
- Discussing backend architecture and separation of concerns, including controllers, services, repositories, and external integrations.
- Implementing product catalogue workflows, including featured products, category browsing, search, and product details.
- Developing the enquiry workflow with request validation and configurable SMTP integration.
- Creating and reviewing backend tests.
- Preparing project documentation and evaluating architectural trade-offs.

## Human-Guided Iterations and Issues Identified

The implementation involved multiple review and refinement cycles. The following are examples of issues identified and directions provided during development.

### 1. SMTP and Docker Configuration

- Identified an email delivery failure (`ECONNREFUSED ::1:1025`) while testing the enquiry workflow.
- Investigated the Docker Compose configuration and identified that Mailpit's SMTP port `1025` was not exposed, even though its web UI port `8025` was accessible.
- Corrected the configuration to expose both ports:
  - `1025:1025` – SMTP communication.
  - `8025:8025` – Mailpit web interface.
- Clarified the difference between container-to-container communication using the `mailpit` hostname and host-based API execution using `127.0.0.1`.

### 2. Frontend Layout and Search Experience

- Reviewed the initial catalogue layout and identified that the search section occupied too much vertical space.
- Requested a more conventional search experience integrated into the top navigation/header.
- Reduced unnecessary hero and introductory content to bring product listings higher on the page.
- Refined the category navigation placement to improve product discovery.

### 3. Theme and Visual Design Refinements

- Explored dark and light theme support during UI iteration.
- Subsequently decided to remove dark mode and retain a consistent light theme.
- Requested a more polished, enterprise-style product card design.
- Refined card presentation with clearer product imagery, pricing, ratings, visual hierarchy, borders, and hover interactions.

### 4. TypeScript Build Issue

- A TypeScript build exposed that Express route parameters could be typed as `string | string[]`.
- The category parameter handling was corrected using runtime type narrowing rather than an unsafe type assertion.

## AI-Generated Code Review and Corrections

AI-generated code was reviewed and validated during implementation. The development process included identifying configuration issues, reviewing generated implementation decisions, and refining the application based on observed behaviour.

Additional issues identified during local development were investigated and corrected before submission.

## Human Review and Validation

AI assistance was treated as a development aid, not a replacement for engineering judgment.

The following responsibilities remained with the developer:

- Reviewing generated code and making implementation decisions.
- Challenging incorrect assumptions and identifying implementation gaps.
- Validating architecture choices and identifying trade-offs.
- Running tests, type checks, and production builds.
- Exercising product browsing, search, and enquiry workflows.
- Verifying email capture through Mailpit and SMTP configuration.
- Reviewing UI behaviour and providing iterative design feedback.
- Understanding security considerations, limitations, and production-readiness gaps.
- Being able to explain the implementation and architectural decisions during technical discussions.