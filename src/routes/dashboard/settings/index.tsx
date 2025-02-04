import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { H1, H2, Subtitle } from '@/components/ui/typography'
import {
	activeSessionsQueryOptions,
	useAuth,
} from '@/features/_shared/user/api/auth.api'
import { ActiveSessionsCard } from '@/features/_shared/user/ui/settings/active-sessions-card'
import { PersonalInformationForm } from '@/features/_shared/user/ui/settings/personal-information-form'
import { SetPasswordForm } from '@/features/_shared/user/ui/settings/set-password-form'
import { UpdatePasswordForm } from '@/features/_shared/user/ui/settings/update-password-form'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/settings/')({
	head: () => ({
		meta: [
			{
				title: m.round_silly_cowfish_pride() + ' - eCommerce Dashboard',
			},
		],
	}),
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(activeSessionsQueryOptions())
	},
	component: () => <Settings />,
})

function Settings() {
	const { user } = useAuth()

	return (
		<div className="max-w-6xl space-y-16">
			<H1>{m.round_silly_cowfish_pride()}</H1>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-1">
					<H2>{m.proud_safe_deer_dance()}</H2>
					<Subtitle>{m.warm_safe_fox_float()}</Subtitle>
				</div>
				<div className="lg:col-span-2">
					<PersonalInformationForm />
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-1">
					<H2>{m.wise_rapid_snake_glow()}</H2>
					<Subtitle>{m.blue_safe_deer_jump()}</Subtitle>
				</div>
				<div className="space-y-8 lg:col-span-2">
					{user.hasPassword ? <UpdatePasswordForm /> : <SetPasswordForm />}
					<ActiveSessionsCard />
				</div>
			</div>
		</div>
	)
}
