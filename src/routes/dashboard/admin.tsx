import { createFileRoute, redirect } from '@tanstack/react-router'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/admin')({
	beforeLoad: async ({ context }) => {
		if (context.auth?.user?.role !== 'admin') {
			throw redirect({ to: '/dashboard' })
		}
	},
	loader: async () => {
		return {
			crumb: m.crazy_round_samuel_endure(),
		}
	},
})
