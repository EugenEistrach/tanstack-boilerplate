import { createFileRoute } from '@tanstack/react-router'

import { SettingsBasicInfoForm } from '@/features/_shared/user/ui/settings-basic-info-form'

import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/settings/')({
	head: () => ({
		meta: [
			{
				title: m.round_silly_cowfish_pride() + ' - eCommerce Dashboard',
			},
		],
	}),
	component: () => <SettingsBasicInfoForm />,
})
