# Client Guidelines

## State Management

- Use TanStack Router and Query as source of truth for server state
- Avoid useState unless absolutely necessary for UI-only state
- Avoid useEffect at all costs. Only should be used for syncronizing with
  external systems
- Keep components simple and focused on rendering data from router/query

## UI and Styling

- Use Shadcn UI and Radix for components
- use `npx shadcn@latest add <component-name>` to add new shadcn components
- Implement Tailwind CSS for styling
- When adding new shadcn component, document the installation command

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use const objects with 'as const' assertion
- Use functional components with TypeScript interfaces
- Use absolute imports with @/ prefix
- Avoid try/catch blocks unless there's good reason to translate or handle error
  in that abstraction
- Return types for functions should be inferred and not explicitly defined

## React 19 Usage

- Refs are automatically forwarded to DOM elements - no need for forwardRef:

```tsx
// Before (React 18)
const Input = forwardRef<HTMLInputElement>((props, ref) => (
	<input ref={ref} {...props} />
))

// After (React 19)
const Input = ({ ref, ...props }) => <input ref={ref} {...props} />

// Usage remains the same
const MyForm = () => {
	const inputRef = useRef<HTMLInputElement>(null)
	return <Input ref={inputRef} />
}
```

## Syntax and Formatting

- Use "function" keyword for pure functions
- Avoid unnecessary curly braces in conditionals
- Use declarative JSX
- Implement proper TypeScript discriminated unions for message types
