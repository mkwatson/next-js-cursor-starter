# Next.js AI-Agent Starter

This Next.js project is specifically configured to enable AI coding agents to generate safe, maintainable, understandable, and production-quality code using Test-Driven Development (TDD).

## Key Guardrails & Features

The repository includes robust configurations designed to enforce best practices automatically:

- **Strict TypeScript Configuration**: Comprehensive compile-time checks to ensure type safety and explicit code.
- **Enhanced ESLint Setup**: Advanced static analysis using plugins for security (`eslint-plugin-security`), maintainability (`eslint-plugin-sonarjs`), React hooks, consistent module imports, and strict TypeScript rules.
- **Runtime Schema Validation (Zod)**: Ensures runtime correctness of data structures and API responses.
- **Improved Built-in Typings (ts-reset)**: Automatically strengthens TypeScript's built-in typings for safer defaults.
- **Pattern Matching (ts-pattern)**: Offers readable, expressive conditionals and reduces complexity.
- **Comprehensive Testing**: Full-stack testing with Vitest (unit/integration), React Testing Library (component tests), and Playwright (E2E tests).

## Quick Start

```bash
npm install
npm run dev             # Start the development server
npm run lint            # Run ESLint checks
npm run test            # Run unit and integration tests
npm run test:e2e        # Run end-to-end tests with Playwright
npm run build           # Build production-ready code
```

Visit [http://localhost:3000](http://localhost:3000) to see your app in action.

## AI Coding Agent Workflow (TDD)

This project explicitly uses Test-Driven Development to guide AI coding agents effectively:

1. **Define Requirements Clearly**: Explicitly describe the desired functionality.
2. **Write the Test First (Red)**: Create failing unit/integration tests before implementation.
3. **Generate Minimal Implementation (Green)**: Instruct the AI agent to implement the simplest solution passing tests.
4. **Refactor**: Use the AI agent to iteratively improve the implementation without breaking tests.
5. **Expand Tests & Functionality**: Continuously add tests to ensure robust functionality and coverage.

### Recommended Testing Tools:
- **Vitest**: Fast unit/integration testing with JS/TS support.
- **React Testing Library**: Component-level testing to ensure reliable UI behaviors.
- **Playwright**: End-to-end testing to verify complete user workflows and application stability.

## Recommended Best Practices

To maximize the quality and safety of generated code, follow these guidelines:

- Always validate external data using explicit Zod schemas.
- Prefer `ts-pattern` for handling complex conditional logic.
- Regularly run static analysis (`npm run lint`) to proactively maintain code quality.
- Follow structured commit messages for clarity and maintainability.
- Ensure structured logging and explicit error handling.

## Structured Logging & Error Handling

This project uses structured logging (`pino`) to improve observability and debugging clarity. Always follow this standardized error handling pattern:

```typescript
import logger from '@/lib/logger';

async function example() {
  try {
    // Your async operation
  } catch (error) {
    logger.error({ error }, 'Descriptive error context');
    throw new Error('Clear, user-friendly error message', { cause: error });
  }
}

## Roadmap & Next Steps

Upcoming additions to further strengthen code quality include:

- CI/CD pipeline integration (GitHub Actions) for automated linting, testing, and deployment.
- Defined documentation standards (JSDoc) and explicit project architecture conventions.
- Cursor project rules for automated enforcement of best practices.

## Contributing

Contributions and improvements are welcome! Please follow a structured approach for commits and pull requests, clearly stating the intent and scope of changes.
