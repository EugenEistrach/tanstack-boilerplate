import { Link, useSearch } from '@tanstack/react-router'
import { CheckCircle2, MailIcon } from 'lucide-react'
import { useSpinDelay } from 'spin-delay'
import { Button, LoadingButton } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmailVerificationMutation } from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

function ResendSuccess() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
					<CheckCircle2 className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.proud_vast_wasp_hum()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4 text-center text-sm text-muted-foreground">
					<p>{m.warm_neat_shark_glow()}</p>
					<p className="text-xs">{m.rapid_pure_mole_hum()}</p>
				</div>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">{m.warm_quick_seal_heal()}</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export function VerificationRequiredCard() {
	const { email } = useSearch({ from: '/_auth/verify-email' })

	const {
		mutate: resendVerification,
		isPending,
		isSuccess: isResendVerificationSuccess,
	} = useEmailVerificationMutation()

	const isResendVerificationPending = useSpinDelay(isPending)

	if (isResendVerificationSuccess) {
		return <ResendSuccess />
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<MailIcon className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.rapid_neat_otter_heal()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					{m.proud_kind_quail_float()}
				</p>
				<p className="text-center text-sm text-muted-foreground">
					{m.warm_early_mole_glow({ email })}
				</p>
				<div className="flex justify-center gap-4">
					<LoadingButton
						variant="default"
						onClick={() => resendVerification({ email })}
						loading={isResendVerificationPending}
					>
						{m.neat_hot_sheep_hum()}
					</LoadingButton>
				</div>
			</CardContent>
		</Card>
	)
}
