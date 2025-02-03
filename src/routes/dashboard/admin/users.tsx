import { createFileRoute } from '@tanstack/react-router'
import { UsersList } from '@/features/admin/ui/users-list'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/admin/users')({
	loader: async () => {
		return {
			crumb: m.level_topical_bumblebee_mop(),
		}
	},
	component: UsersList,
})
