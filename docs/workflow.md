# Feature Development Workflow

This guide provides a detailed walkthrough of our feature development workflow.

## Documentation Analysis

Before writing any code, identify and review relevant documentation:

1. Create a documentation checklist:

   ```
   Documentation Checklist Format:
   [R/O] doc-name.md - Reason for inclusion

   R = Required reading
   O = Optional, read if needed
   ```

2. Common documentation needs:

   - Database changes → [R] schema.md
   - Domain logic → [R] domain.md
   - API layer → [R] api.md
   - Type-safe validation → [R] validation.md
   - UI components → [R] ui.md
   - Route changes → [R] routing.md

3. Read all the required documentation files!

## Implementation Planning

After reading required documentation, create an implementation checklist:

1. List steps in dependency order:

   ```
   Implementation Steps Format:
   1. Step description (required docs)
   2. Next step (required docs)
   ```

2. Common implementation patterns:

   ### Backend First Approach

   1. Database Layer (if needed)

      - Create feature schema file (schema.md)
      - Add to exports and schema (schema.md)
      - Define tables and relations (schema.md)
      - Follow SQLite field patterns (schema.md)

   2. Domain Layer

      - Business logic (domain.md)
      - Type definitions (domain.md)
      - Data transformations (domain.md)

   3. API Layer

      - Input validation schemas (validation.md)
      - Server functions (api.md)
      - Query/mutation hooks (api.md)

   4. UI Layer

      - State management with TanStack (ui.md)
      - Shadcn/UI components (ui.md)
      - Form validation (validation.md)
      - Data fetching and mutations (api.md)

   5. Routing Layer (if needed)
      - Route setup (routing.md)
      - Navigation integration (routing.md)

## Example Workflow

Here's a complete example for adding a new feature:

1. Documentation Checklist:

   ```
   [R] schema.md - New database table needed
   [R] domain.md - Business logic implementation
   [R] api.md - API layer implementation
   [R] validation.md - Input validation for API and forms
   [R] ui.md - UI components and patterns
   ```

2. Implementation Steps:

   ```
   1. Database Layer
      - Create feature schema file
      - Add to exports and schema
      - Define tables and relations
      - Follow SQLite patterns

   2. Domain Layer
      - Business logic
      - Type definitions
      - Data transformations

   3. API Layer
      - Input validation schemas
      - Server functions
      - Query/mutation hooks

   4. UI Layer
      - State management with TanStack
      - Shadcn/UI components
      - Form validation
      - Data fetching and mutations
   ```

Now start with the checklist, remember the backend-first approach!
