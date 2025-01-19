# Feature Development Workflow

This guide provides a detailed walkthrough of our feature development workflow,
using the onboarding feature as a practical example.

## 1. Documentation Analysis

Before writing any code, identify and review relevant documentation:

```
Example - Onboarding Feature Requirements:
- User form with name and favorite color
- Validation and error handling
- Redirect after completion
- Admin role assignment based on email

Required Documentation:
1. client.md
   - Form handling patterns
   - Component library usage
   - State management guidelines

2. api.md
   - Server function setup
   - Query/mutation patterns
   - Validation approach

3. server.md
   - Database operations
   - Transaction handling
   - Auth session management

4. routing.md
   - Route creation patterns
   - Authentication handling
   - Navigation integration
```

## 2. Implementation Flow

### 2.1 Database Schema (if needed)

> 📖 Detailed guidelines: `docs/schema.md`

1. Create schema file in `src/drizzle/schemas/`
2. Add exports to `_exports.ts` and `schema.ts`
3. Run migrations: `pnpm db:generate && pnpm db:migrate`

### 2.2 Route Setup (src/routes/)

> 📖 Detailed guidelines: `docs/routing.md`

1. Create route file in appropriate directory:

   - Public routes in `_marketing/`
   - Auth routes in `(auth)/`
   - Protected routes in `dashboard/`
   - Admin routes in `dashboard/admin/`

2. Add to navigation if needed:
   - Update dashboard navigation
   - Add breadcrumbs
   - Configure page title

### 2.3 UI Components (src/features/[feature]/ui/)

> 📖 Detailed guidelines: `docs/client.md`

1. Create component file with appropriate name:

   ```typescript
   // onboarding-form.tsx
   import { valibotResolver } from '@hookform/resolvers/valibot'
   import { useForm } from 'react-hook-form'
   import * as v from 'valibot'

   // Define validation schema
   const onboardingFormSchema = v.object({
   	name: v.pipe(v.string(), v.minLength(1)),
   	favoriteColor: v.pipe(v.string(), v.minLength(1)),
   })

   // Create form component
   export function OnboardingForm() {
   	const form = useForm({
   		resolver: valibotResolver(onboardingFormSchema),
   	})
   	// ... form implementation
   }
   ```

2. Define required data structures:

   - Form schema
   - Component props
   - State interfaces

3. Implement UI following client.md patterns:
   - Use shadcn components
   - Implement form validation
   - Handle loading states

### 2.4 API Layer (src/features/[feature]/api/)

> 📖 Detailed guidelines: `docs/api.md`

1. Create API file:

   ```typescript
   // onboarding.api.ts
   import { queryOptions, useMutation } from '@tanstack/react-query'
   import { createServerFn } from '@tanstack/start'

   // Define query options
   export const getOnboardingInfoQueryOptions = () =>
   	queryOptions({
   		queryKey: ['onboardingInfo'],
   		queryFn: () => $getOnboardingInfo(),
   	})

   // Create mutation hook
   export const useCompleteOnboardingMutation = () =>
   	useMutation({
   		mutationFn: $completeOnboarding,
   		// ... mutation options
   	})

   // Define server functions
   const $completeOnboarding = createServerFn({ method: 'POST' })
   	.validator(schema)
   	.handler(async ({ data }) => {
   		// ... implementation
   	})
   ```

2. Define server functions:

   - Add validation schemas
   - Implement error handling
   - Set up proper typing

3. Create query/mutation hooks:
   - Define query keys
   - Set up cache invalidation
   - Handle loading/error states

### 2.5 Domain Logic (src/features/[feature]/domain/)

> 📖 Detailed guidelines: `docs/server.md`

1. Create server file:

   ```typescript
   // onboarding.server.ts
   import { db } from '@/drizzle/db'

   export function completeOnboarding({
   	userId,
   	favoriteColor,
   	name,
   }: {
   	userId: string
   	favoriteColor: string
   	name: string
   }) {
   	return db.transaction(async (tx) => {
   		// ... database operations
   	})
   }
   ```

2. Implement business logic:

   - Database operations
   - Data transformations
   - Business rules

3. Add tests:

   ```typescript
   // onboarding.server.test.ts
   import { describe, it, expect } from 'vitest'

   describe('onboarding', () => {
   	it('completes onboarding process', async () => {
   		// ... test implementation
   	})
   })
   ```

## 3. Testing

> 📖 Detailed guidelines: `docs/unit-testing.md`

1. Add tests for domain logic:

   ```typescript
   // onboarding.server.test.ts
   import { describe, expect, it } from 'vitest'
   import { testDb } from '@/tests/setup/test-db'
   import { UserTable } from '@/drizzle/schemas/_exports'
   import { createUser } from '@/tests/test-utils'
   import { completeOnboarding } from './onboarding.server'

   describe('onboarding.server', () => {
   	describe('completeOnboarding', () => {
   		it('should complete onboarding for regular user', async () => {
   			const user = createUser()

   			await completeOnboarding({
   				userId: user.id,
   				favoriteColor: 'red',
   				name: 'New Name',
   			})

   			const updatedUser = testDb
   				.select()
   				.from(UserTable)
   				.where(eq(UserTable.id, user.id))
   				.get()

   			expect(updatedUser).toMatchObject({
   				name: 'New Name',
   				role: 'user',
   			})
   		})
   	})
   })
   ```

2. Test coverage should include:

   - Success and error cases
   - Business logic transformations
   - External service mocks (using MSW)
   - Database state verification

3. Run tests:
   ```bash
   pnpm vitest
   ```

For detailed testing patterns and best practices, refer to
`docs/unit-testing.md`.
