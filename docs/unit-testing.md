## Test Implementation Guidelines

### Core Principles

- Understand the implementation before writing tests
- Never modify the code being tested
- Write all test code in the test file only
- Ask for clarification if uncertain about test requirements
- Always use MSW for mocking HTTP requests - never mock fetch directly
- Never proceed to next describe block until all tests pass
- When tests fail, first repeat the exact failure messages and analyze possible
  causes before proceeding

### Test Environment

- Database cleanup is handled automatically by `setup-test-env.ts`
- Create abstractions for shared test functionality when needed

### Test Outline

Before implementation, create a test outline that:

- Starts with throwing errors in each test case
- Groups related functionality in describe blocks
- Covers happy path, input validation, errors, and edge cases
- Uses clear, behavior-focused descriptions

Example structure:

```typescript
describe('functionName', () => {
	// Happy Path
	it('completes successfully with valid input', () => {
		throw new Error('Test not implemented')
	})

	// Input Validation
	it('validates required parameters', () => {
		throw new Error('Test not implemented')
	})

	// Error Cases
	it('handles errors gracefully', () => {
		throw new Error('Test not implemented')
	})

	// Edge Cases
	it('handles boundary conditions correctly', () => {
		throw new Error('Test not implemented')
	})
})
```

### Database Usage

- Use Drizzle ORM for all database operations
- Database state is automatically cleaned between tests
- Import database and schemas from drizzle setup:
  ```typescript
  import { testDb } from '@/tests/setup/test-db'
  import { EnvironmentTable } from '@/drizzle/schemas/deployments-schema'
  ```

#### Example: Database Operations in Tests

```typescript
import { eq } from 'drizzle-orm'
import { testDb } from '@/tests/setup/test-db'
import { EnvironmentTable } from '@/drizzle/schemas/deployments-schema'

beforeEach(async () => {
	// Update existing records
	await testDb
		.update(EnvironmentTable)
		.set({
			jiraData: {
				priority: 1,
				deployStatus: 'In DEV',
				commitFieldId: 'customfield_13910',
			},
		})
		.where(eq(EnvironmentTable.id, 'dev'))

	// Insert new records
	await testDb.insert(EnvironmentTable).values({
		id: 'test-env',
		name: 'Test Environment',
		code: 'test-env',
		enabled: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	})
})
```

### Mocking External APIs

- Use MSW (Mock Service Worker) for external API calls
- Add mocks directly in the test files where needed
- Never mock `fetch` directly - always use MSW
- Never add expect statements in the mock functions. Instead if body needs to be
  validated, use conditional logic and return an error response
- Existing mock resources:
  - Factory functions in `src/tests/mocks/**/*.fixtures.ts`
  - Happy path mocks in `.mocks.ts` files
  - Pre-built mocks available for GitHub and Jira
  - Extend or create new factory functions as needed
  - Do not modify existing happy path mocks
  - New happy path mocks can be added

#### Example: Mocking API Request

```typescript
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/tests/mocks/setupMsw'

it('handles API request with validation', async () => {
	const requestBody = { summary: 'Test Issue' }
	const mockResponse = { id: '123', created: true }

	server.use(
		http.post('https://api.example.com/endpoint', async ({ request }) => {
			const body = await request.json()

			// Validate request body
			if (JSON.stringify(body) !== JSON.stringify(requestBody)) {
				return new HttpResponse(null, { status: 400 })
			}

			return HttpResponse.json(mockResponse)
		}),
	)

	// Your test implementation here
})
```

### Implementation Workflow

1. Review the implementation to be tested by reading the file
2. Start with the first describe block
3. Implement the describe block
4. Run terminal command
   `pnpm vitest run src/path/to/file.test.ts -t "describe block name" --no-coverage`
   to validate the tests
5. Wait for tests to pass before proceeding to next describe block

If tests fail:

1. Repeat the exact error messages from the test output
2. Analyze and list possible causes for the failure
3. Explain your thought process about why the test might be failing
4. Propose a solution or ask for guidance if needed

Before starting with the workflow, please explain in your words the required
steps you need to take next to make sure you understand the instructions.