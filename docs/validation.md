# Validation Guidelines

This guide outlines our validation patterns using valibot.

## Key Concepts

1. **Pipelines Instead of Chaining**

   ```typescript
   // ❌ Don't (Zod style)
   const schema = z.string().email().endsWith('@company.com')

   // ✅ Do (Valibot style)
   const schema = v.pipe(v.string(), v.email(), v.endsWith('@company.com'))
   ```

2. **Standalone Functions Instead of Methods**

   ```typescript
   // ❌ Don't (Zod style)
   const result = schema.parse(data)

   // ✅ Do (Valibot style)
   const result = v.parse(schema, data)
   ```

## Common Patterns

### Form Validation

```typescript
// Form schema with validation
const formSchema = v.object({
	email: v.pipe(v.string('Email is required'), v.email('Must be valid email')),
	password: v.pipe(
		v.string('Password is required'),
		v.minLength(8, 'Must be at least 8 characters'),
	),
})

// Use with react-hook-form
const form = useForm({
	resolver: valibotResolver(formSchema),
})
```

### API Input Validation

```typescript
const $createUser = createServerFn({ method: 'POST' })
	.validator(
		v.object({
			name: v.string(),
			email: v.pipe(v.string(), v.email()),
			role: v.enum(['user', 'admin']),
		}),
	)
	.handler(async ({ data }) => {
		// Type-safe data access
	})
```

### Object Validation

```typescript
// Strict object (no unknown properties)
const strictSchema = v.strictObject({
	id: v.string(),
	count: v.number(),
})

// Optional properties
const userSchema = v.object({
	id: v.string(),
	name: v.string(),
	email: v.optional(v.pipe(v.string(), v.email())),
})
```

### Type Inference

```typescript
// Get type from schema
type FormData = v.InferOutput<typeof formSchema>

// Use in component props
interface Props {
	data: v.InferOutput<typeof dataSchema>
}
```

## Error Messages

```typescript
// Single error message
const schema = v.string('Must be a string')

// Multiple validation steps
const schema = v.pipe(
	v.string('Must be a string'),
	v.minLength(3, 'Too short'),
	v.maxLength(10, 'Too long'),
)
```

## Type Coercion

```typescript
// String to number
const numberSchema = v.pipe(
	v.string(),
	v.decimal('Must be decimal string'),
	v.transform(Number),
)

// String to date
const dateSchema = v.pipe(
	v.string(),
	v.isoDateTime('Must be ISO date'),
	v.transform((str) => new Date(str)),
)
```
