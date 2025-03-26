# Next.js AI-Agent Starter

This Next.js project is explicitly designed and configured to enable AI coding agents to generate safe, maintainable, understandable, and production-quality code through structured Test-Driven Development (TDD), strict coding standards, and clear task-reflection guidelines.

## Key Guardrails & Features

The project includes strict, automated guardrails and explicit standards:

- **Strict TypeScript Configuration**: Ensures type safety, clear explicitness, and robust compile-time checks.
- **Advanced ESLint Setup**: Powerful static analysis enforcing security (`eslint-plugin-security`), maintainability (`eslint-plugin-sonarjs`), React hooks compliance, import consistency, JSDoc documentation, and TypeScript best practices.
- **Runtime Schema Validation (Zod)**: Guarantees correctness and safety of runtime data structures and API responses.
- **Improved Built-in Typings (ts-reset)**: Automatically strengthens TypeScript's default typings.
- **Pattern Matching (ts-pattern)**: Provides expressive and readable conditional logic.
- **Comprehensive Testing Suite**: Robust testing frameworks covering unit/integration tests (Vitest), component-level tests (React Testing Library), and end-to-end tests (Playwright).
- **Structured Logging & Explicit Error Handling**: Clearly defined logging patterns using `pino` and explicit error-handling standards.

## Explicit Project Structure

The codebase strictly follows a clear project structure under the `src/` directory:

```
src/
├── app/              # Next.js App Router components and layouts
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── lib/              # Shared libraries and utilities (e.g., structured logging)
├── schemas/          # Zod schemas for explicit runtime validation
├── utils/            # General-purpose utility functions
└── tests/            # Comprehensive testing suite
    ├── unit/         # Unit tests for utilities, hooks, and components
    ├── e2e/          # End-to-end tests using Playwright
    └── setup.ts      # Test setup file for Vitest
```

## Quick Start

Explicitly install dependencies and run development commands:

```bash
npm install
npm run dev              # Start development server
npm run lint             # Run ESLint compliance checks
npm run test             # Run unit and integration tests (Vitest)
npm run test:e2e         # Run end-to-end tests (Playwright)
npm run build            # Build optimized production-ready code
npm run typecheck        # Explicitly check TypeScript compliance
```

Open [http://localhost:3000](http://localhost:3000) to access your application locally.

## AI Coding Agent Workflow (Explicit TDD)

This project explicitly employs TDD to guide AI agents in producing robust software:

1. **Reflect on Task Size and Clarity**: Always explicitly ensure tasks are clearly defined, optimally sized, actionable, and testable.
2. **Write Failing Tests (Red)**: Clearly define explicit expectations in tests before implementation.
3. **Minimal Implementation (Green)**: Implement the simplest explicit solution to pass tests.
4. **Refactor Explicitly**: Improve code readability and maintainability explicitly without breaking tests.
5. **Expand Tests & Functionality Explicitly**: Continuously and explicitly add further tests and functionality for comprehensive coverage.

### Recommended Testing Tools

- **Vitest**: Fast, reliable JS/TS testing for unit/integration.
- **React Testing Library**: Reliable component-level testing.
- **Playwright**: Explicit end-to-end testing for user workflows.

## Explicit Best Practices & Standards

Follow these explicitly enforced guidelines:

- **Runtime Validation**: Explicitly validate external data using Zod schemas.
- **Structured Logging and Errors**: Consistently log structured events and explicitly handle errors.
- **Clear Conditional Logic**: Explicitly use `ts-pattern` for readability.
- **Regular ESLint & Type Checks**: Run compliance explicitly and frequently (`npm run lint`, `npm run typecheck`).
- **Structured Commits**: Clearly document commits explicitly.

### Structured Logging & Error Handling Example

Use this explicit standard pattern:

```typescript
import logger from '@/lib/logger';

async function fetchData() {
  try {
    // Explicit async operation
  } catch (error) {
    logger.error({ error }, 'Explicit error message');
    throw new Error('Clear, user-facing message', { cause: error });
  }
}
```

## Explicit Task Reflection Guidelines

Before starting tasks, explicitly reflect to ensure tasks are optimally sized:

- Clearly defined and explicit outcomes.
- Single responsibility, explicitly testable via TDD.
- Explicitly actionable without additional context or future tasks.

If unclear, explicitly break down tasks or seek human clarification.

## ESLint Configuration

The project uses a modern flat ESLint configuration in `eslint.config.mjs` with multiple plugins for code quality:

- **@typescript-eslint**: Strict type-checking and TypeScript best practices
- **eslint-plugin-security**: Identifies potential security vulnerabilities
- **eslint-plugin-sonarjs**: Detects code smells and maintainability issues
- **eslint-plugin-react-hooks**: Enforces React Hooks rules
- **eslint-plugin-import**: Ensures proper import organization
- **eslint-plugin-jsdoc**: Enforces documentation standards

Key rules enforce:
- Explicit function return types
- No floating promises or unhandled rejections
- JSDoc documentation for functions and classes
- Proper import ordering and organization
- Security vulnerability detection
- Code complexity limitations

## CI/CD Configuration

The project includes GitHub Actions CI workflow (`.github/workflows/ci.yml`) that:
- Runs ESLint to ensure code quality
- Performs TypeScript typechecking
- Executes unit/integration tests (Vitest)
- Runs end-to-end tests (Playwright)
- Builds the project for production

This ensures all code changes meet the project's strict quality standards before being merged.

## Roadmap & Future Enhancements

Upcoming explicit improvements:

- **Enhanced CI/CD Pipeline**: Add deployment steps and performance benchmarking
- **Extended Documentation**: Further explicit examples and guides
- **Continuous Refinement of Cursor Rules**: Explicitly automate and enforce coding standards

## Contributing

Explicitly follow structured commits and document clearly the scope and intent of your changes. Contributions explicitly improving clarity, maintainability, and correctness are highly encouraged!
