import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
	loader: ({ context }) => {
		return {
			crumb: context.t('settings.title'),
		}
	},
	component: () => <Outlet />,
})
