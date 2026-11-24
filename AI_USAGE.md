# AI usage notes

## Tools and models

- VS Code
- ChatGPT (GPT-6)

## Plan and key prompts

- Requested a direct starter project using React + TypeScript and Node.js + TypeScript.
- Requested backend product architecture with Fake Store adapter, product endpoints and tests.
- Requested frontend catalogue flows: home, category, search and product details.
- Requested completion of the enquiry workflow with a configurable email integration.

## AI mistakes caught during review

- A TypeScript build exposed that Express route parameters were typed as `string | string[]`; the category parameter was updated to use runtime type narrowing instead of an unsafe type assertion.
- Record any additional issues discovered during your own local review before submission.

## Human review still required

- Run tests, typecheck and build on the target machine.
- Exercise the product catalogue and enquiry flow in a browser.
- Verify the captured email in Mailpit and, if configured, test the approved SMTP provider.
- Review all generated code and be prepared to explain the trade-offs.
