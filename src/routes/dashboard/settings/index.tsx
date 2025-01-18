import { createFileRoute } from '@tanstack/react-router'

import { SettingsBasicInfoForm } from '@/features/settings/ui/settings-basic-info-form'

import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/settings/')({
	loader: async () => {
		return {
			crumb: m.settings_title(),
		}
	},
	head: () => ({
		meta: [
			{
				title: m.settings_title() + ' - eCommerce Dashboard',
			},
		],
	}),
	component: () => <SettingsBasicInfoForm />,
})
