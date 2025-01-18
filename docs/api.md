# Server Functions

Server functions in our application use TanStack Start to create type-safe
server endpoints that can be called directly from the client.

## File Organization

- All server functions should be placed in `.api.ts` files within the feature's
  `api` directory
- Server functions are private (not exported) and accessed through exported
  query/mutation options
- Keep related server functions and their query options together in the same
  file

## Basic Structure

A `.api.ts` file follows this pattern:

```typescript
// Query options exports (placed at the top)
export const useDataQueryOptions = (params: DataParams) =>
	queryOptions({
		queryKey: ['data', params],
		queryFn: () => $getData({ data: params }),
	})

// Private server functions (placed below query options)
const $getData = createServerFn({ method: 'GET' })
	.middleware([loggingMiddleware])
	.validator(validationSchema)
	.handler(async ({ data }) => {
		// Implementation
	})
```

## Example Usage

### Query Pattern

```typescript
// In feature/api/items.api.ts

// Export query options for data fetching
export const useItemsQueryOptions = (params: ItemsParams) =>
	queryOptions({
		queryKey: ['items', params],
		queryFn: () => $getItems({ data: params }),
		refetchInterval: 10000,
	})

// Private server function
const $getItems = createServerFn({ method: 'GET' })
	.middleware([loggingMiddleware])
	.validator(itemsSchema)
	.handler(async ({ data }) => {
		// Implementation
	})

// Usage in component:
const { data } = useSuspenseQuery(useItemsQueryOptions(params))
```

### Mutation Pattern

```typescript
// Export mutation function for state changes
export const useCreateItemMutation = () =>
	useMutation({
		mutationFn: (data: CreateItemData) => $createItem({ data }),
		// ... other options
	})

// Private server function
const $createItem = createServerFn({ method: 'POST' })
	.middleware([loggingMiddleware])
	.validator(createItemSchema)
	.handler(async ({ data }) => {
		// Implementation
	})
```

## Best Practices

- Prefix private server function names with `$` (e.g., `$getDeployments`)
- Export query options and mutation functions, never server functions directly
- Place query options above server functions in the file
- Use valibot for input validation
- Include appropriate middleware (e.g., logging, authentication)
- Group related functionality in feature-specific API files

## Common Patterns

### Authentication

```typescript
// In auth.api.ts
export const useProtectedDataQueryOptions = (params: DataParams) =>
	queryOptions({
		queryKey: ['protected-data', params],
		queryFn: () => $getProtectedData({ data: params }),
	})

const $getProtectedData = createServerFn({ method: 'POST' })
	.middleware([loggingMiddleware])
	.validator(schema)
	.handler(async ({ data }) => {
		await requireAuthSession()
		// Implementation
	})
```

### Error Handling

```typescript
// In error-handling.api.ts
export const useDataWithErrorsQueryOptions = (params: DataParams) =>
	queryOptions({
		queryKey: ['data-with-errors', params],
		queryFn: () => $handleErrors({ data: params }),
	})

const $handleErrors = createServerFn({ method: 'POST' })
	.middleware([loggingMiddleware])
	.validator(schema)
	.handler(async ({ data }) => {
		try {
			const result = await someOperation(data)
			return { success: true, data: result }
		} catch (error) {
			if (error instanceof Error) {
				return { success: false, error: error.message }
			}
			throw error
		}
	})
```

### Query Options with Pagination

```typescript
// In items.api.ts
export const useItemsQueryOptions = ({
	page = 1,
	pageSize = DEFAULT_PAGE_SIZE,
}) =>
	queryOptions({
		queryKey: ['items', page, pageSize],
		queryFn: () => $getItems({ data: { page, pageSize } }),
		placeholderData: keepPreviousData,
		refetchInterval: 10000,
	})

const $getItems = createServerFn({ method: 'GET' })
	.middleware([loggingMiddleware])
	.validator(paginationSchema)
	.handler(async ({ data }) => {
		// Implementation
	})
```

## Example: Feature API File

```typescript
// In deployments.api.ts

// Query Options
export const useDeploymentsQueryOptions = (params: DeploymentParams) =>
	queryOptions({
		queryKey: ['deployments', params],
		queryFn: () => $getDeployments({ data: params }),
	})

export const useCreateDeploymentMutation = () =>
	useMutation({
		mutationFn: (data: CreateDeploymentData) => $createDeployment({ data }),
	})

// Private Server Functions
const $getDeployments = createServerFn({ method: 'GET' })
	.middleware([loggingMiddleware])
	.validator(paginationSchema)
	.handler(async ({ data }) => {
		// Implementation
	})

const $createDeployment = createServerFn({ method: 'POST' })
	.middleware([loggingMiddleware])
	.validator(createDeploymentSchema)
	.handler(async ({ data }) => {
		// Implementation
	})
```
