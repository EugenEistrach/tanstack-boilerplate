import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin')({
	beforeLoad: async ({ context }) => {
		if (context.auth?.user?.role !== 'admin') {
			throw redirect({ to: '/dashboard' })
		}
	},
})
