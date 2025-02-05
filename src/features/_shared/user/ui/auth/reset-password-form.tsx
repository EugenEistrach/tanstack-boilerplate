import { arktypeResolver } from '@hookform/resolvers/arktype'
import { Link, useSearch } from '@tanstack/react-router'
import { type } from 'arktype'
import { CheckCircle2, DatabaseZap, KeyRound, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { Button, LoadingButton } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import PasswordInput, { Input } from '@/components/ui/input'
import {
	usePasswordResetMutation,
	usePasswordResetRequestMutation,
} from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

function ResetPasswordSuccess() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
					<CheckCircle2 className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.curly_knotty_iguana_cut()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4 text-center text-sm text-muted-foreground">
					<p>{m.helpful_each_dolphin_tend()}</p>
					<p className="text-xs">{m.grassy_orange_wren_dial()}</p>
				</div>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">{m.trite_east_alligator_grin()}</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

const resetPasswordSchema = type({
	email: 'string.email >= 1',
})

const newPasswordSchema = type({
	password: 'string >= 8',
})

function NewPasswordForm({ token }: { token: string }) {
	const form = useForm({
		resolver: arktypeResolver(newPasswordSchema),
		defaultValues: {
			password: '',
		},
	})

	const {
		mutate: resetPassword,
		isPending,
		isSuccess: isResetPasswordSuccess,
	} = usePasswordResetMutation()

	const isResetPasswordPending = useSpinDelay(isPending)

	async function onSubmit(values: { password: string }) {
		resetPassword({ token, password: values.password })
	}

	if (isResetPasswordSuccess) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
						<CheckCircle2 className="h-6 w-6" />
					</div>
					<CardTitle className="text-center text-2xl font-bold">
						{m.polite_fine_sawfish_hike()}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-sm text-muted-foreground">
						{m.wise_sound_tiger_dream()}
					</p>
					<div className="flex justify-center">
						<Button asChild>
							<Link to="/login">{m.full_many_meerkat_lock()}</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<KeyRound className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.dirty_quick_vole_flow()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					{m.cozy_funny_nils_revive()}
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.bald_brief_otter_swim()}</FormLabel>
									<FormControl>
										<PasswordInput
											placeholder={m.factual_bold_lamb_arise()}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isResetPasswordPending}
								Icon={Send}
							>
								{m.slow_mad_donkey_ripple()}
							</LoadingButton>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

export function ResetPasswordForm() {
	const search = useSearch({ from: '/_auth/reset-password' })

	const form = useForm({
		resolver: arktypeResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const {
		mutate: requestPasswordReset,
		isPending,
		isSuccess: isRequestPasswordResetSuccess,
	} = usePasswordResetRequestMutation()

	const isRequestPasswordResetPending = useSpinDelay(isPending)

	async function onSubmit(values: { email: string }) {
		requestPasswordReset(values)
	}

	if (search.token) {
		return <NewPasswordForm token={search.token} />
	}

	if (isRequestPasswordResetSuccess) {
		return <ResetPasswordSuccess />
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<DatabaseZap className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.inner_fine_osprey_clip()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					{m.dull_mushy_barbel_trip()}
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.tame_next_lobster_succeed()}</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder={m.curly_fair_racoon_honor()}
											{...field}
										/>
									</FormControl>
									<FormMessage>{m.patchy_direct_ocelot_burn()}</FormMessage>
								</FormItem>
							)}
						/>
						<div className="pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isRequestPasswordResetPending}
								Icon={KeyRound}
							>
								{m.house_arable_haddock_rest()}
							</LoadingButton>
						</div>
					</form>
				</Form>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">{m.maroon_empty_jackal_boost()}</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
