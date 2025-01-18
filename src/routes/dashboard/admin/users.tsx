import { createFileRoute } from '@tanstack/react-router'
import { UsersList } from '@/features/admin/ui/users-list'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/admin/users')({
	loader: async () => {
		return {
			crumb: m.nav_users(),
		}
	},
	component: UsersList,
})
