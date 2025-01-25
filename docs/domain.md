# Server Guidelines

This document outlines guidelines for server-side development, focusing on
business logic and database operations.

## Core Principles

- Keep business logic and database operations in `.server.ts` files
- Follow separation of concerns between business logic and API layer
- Never use translations in server code - error messages should be in English

## File Organization

- Place all server-side code in `.server.ts` files
- Group related functionality in feature-specific directories
- Keep tests alongside implementation in `.server.test.ts` files
- Maintain clear separation between business logic and database operations

## Database Operations

- Use Drizzle's query builder for all database operations
- Keep database operations atomic and transactional where needed
- Handle errors appropriately and provide meaningful error messages
- Document complex queries with comments explaining the logic

Example database operation:

```typescript
export async function createDeployment(data: DeploymentData) {
	return db.transaction(async (tx) => {
		// Implementation with proper error handling
	})
}
```

## Schema Changes & Migrations

- When schema changes are needed run `pnpm db:generate` to generate a new
  migration
- Afterwards run `pnpm db:migrate` to apply the migration to the database