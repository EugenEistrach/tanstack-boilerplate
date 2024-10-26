import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useTranslations } from 'use-intl'

export const Route = createFileRoute('/dashboard/settings')({
	loader: ({ context }) => {
		return {
			crumb: context.t('settings.title'),
		}
	},
	component: () => <Outlet />,
})
