import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users')({
	component: () => <div>Hello /dashboard/users!</div>,
})
