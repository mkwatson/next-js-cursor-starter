# Next.js AI-Agent Starter

This Next.js project is specifically configured to enable AI coding agents to generate safe, maintainable, understandable, and production-quality code.

## Key Guardrails & Features

The repository includes robust configurations designed to enforce best practices automatically:

- **Strict TypeScript Configuration**: Comprehensive compile-time checks to ensure type safety and explicit code.
- **Enhanced ESLint Setup**: Advanced static analysis using plugins for security (`eslint-plugin-security`), maintainability (`eslint-plugin-sonarjs`), React hooks, and consistent module imports.
- **Runtime Schema Validation (Zod)**: Ensures runtime correctness of data structures and API responses.
- **Improved Built-in Typings (ts-reset)**: Automatically strengthens TypeScript's built-in typings for safer defaults.
- **Pattern Matching (ts-pattern)**: Offers readable, expressive conditionals and reduces complexity.

## Quick Start

```bash
npm install
npm run dev          # Start the development server
npm run lint         # Run ESLint checks
npm run build        # Build production-ready code
```

Visit [http://localhost:3000](http://localhost:3000) to see your app in action.

## Recommended Best Practices

To maximize the quality and safety of generated code, follow these guidelines:

- Always validate external data using explicit Zod schemas.
- Prefer `ts-pattern` for handling complex conditional logic.
- Regularly run static analysis (`npm run lint`) to proactively maintain code quality.
- Follow structured commit messages for clarity and maintainability.

## Roadmap & Next Steps

Upcoming additions to further strengthen code quality include:

- Comprehensive automated testing (unit, integration, and E2E tests).
- CI/CD pipeline integration (GitHub Actions) for automated linting, testing, and deployment.
- Standardized error handling and logging strategies.
- Defined project architecture and documentation standards.

## Contributing

Contributions and improvements are welcome! Please follow a structured approach for commits and pull requests, clearly stating the intent and scope of changes.
