# Real-Time Collaborative Document Editor

This document clearly defines the explicit scope and requirements for building a Real-Time Collaborative Document Editor. The AI coding agent must explicitly follow these detailed guidelines.

---

## 1. Overview

The Real-Time Collaborative Document Editor allows multiple users to concurrently create, edit, and collaborate on documents in real-time. The system ensures seamless synchronization and conflict resolution.

---

## 2. Core Functionalities

### 2.1 Real-Time Collaboration
- Multiple users can edit a document simultaneously.
- Real-time synchronization of edits using WebSockets or similar technology.

### 2.2 Conflict Resolution
- Implement robust conflict resolution using Conflict-free Replicated Data Types (CRDT) or Operational Transformation (OT).
- Edits must seamlessly merge without loss of data or user confusion.

### 2.3 Document Editing Features
- Basic rich-text formatting including bold, italic, underline, and lists (ordered/unordered).
- Live cursor tracking and user presence indicators.

### 2.4 Persistent Storage
- Explicitly save and retrieve documents from persistent storage.
- Ensure data integrity and version control.

---

## 3. Technical Requirements

### 3.1 Frontend
- Use Next.js with strict TypeScript standards.
- Components must be clearly structured, tested, and documented (JSDoc).
- Responsive UI suitable for various screen sizes.

### 3.2 Backend
- Use Next.js backend (API routes or server actions).
- Explicit use of WebSockets or Server-Sent Events for real-time communication.
- Structured logging and explicit error handling using the project's logger.

### 3.3 Runtime Validation
- Explicitly define and validate all data structures using Zod schemas.
- Ensure robust data validation at runtime.

---

## 4. Testing Requirements

### 4.1 Test-Driven Development (TDD)
- Always explicitly write unit and integration tests (Vitest) before implementation.
- Follow the explicit TDD workflow: Red (fail first), Green (minimum passing implementation), Refactor.

### 4.2 End-to-End Testing (Playwright)
- Explicitly test scenarios involving multiple concurrent users editing documents.
- Ensure UI, synchronization, and conflict resolution work correctly end-to-end.

---

## 5. Structured Logging & Error Handling

- Explicitly log significant events including connections, disconnections, edits, and conflicts.
- Explicitly handle all asynchronous and potentially failing operations using clear `try-catch` patterns with structured logging.

---

## 6. Security and Permissions

- Basic authentication to identify users.
- Ensure secure handling of document data and prevent unauthorized access.
- Explicitly document and enforce security constraints clearly.

---

## 7. Task Reflection and Optimal Sizing

Before beginning any task:
- Explicitly reflect and verify the task is clearly defined, optimally sized, testable, and fully actionable.
- Explicitly break down tasks or seek clarification if any ambiguity or complexity is identified.

---

## 8. Verification and Final Checks

Before marking tasks complete, explicitly verify:
- ESLint and TypeScript compliance (`npm run lint`, `npm run typecheck`).
- All tests pass (`npm run test`, `npm run test:e2e`).
- Documentation and explicit error handling standards are followed.

This document explicitly outlines the comprehensive scope and expectations. Ensure strict compliance with all guidelines.