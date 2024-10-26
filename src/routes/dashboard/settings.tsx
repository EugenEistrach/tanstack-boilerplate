import { createFileRoute, Outlet } from '@tanstack/react-router'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/settings')({
	loader: () => {
		return {
			crumb: m.settings_title(),
		}
	},
	component: () => <Outlet />,
})
