import { arktypeResolver } from '@hookform/resolvers/arktype'
import { Link } from '@tanstack/react-router'
import { type } from 'arktype'
import { CirclePlus, DatabaseZap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { GithubIcon } from '@/components/icons/github-icon'
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
import { LoadingButton } from '@/components/ui/loading-button'
import {
	useEmailSignUpMutation,
	useSocialSignInMutation,
	EmailNotAvailableError,
} from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

const registerFormSchema = type({
	name: 'string >= 1',
	email: 'string.email >= 1',
	password: 'string >= 8',
})

export function RegisterForm() {
	const form = useForm({
		resolver: arktypeResolver(registerFormSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	const { mutate: signUp, isPending: isEmailSignUpPending } =
		useEmailSignUpMutation()
	const { mutate: signInWithSocial, isPending: isSocialSignInPending } =
		useSocialSignInMutation()

	function onSubmit(values: { name: string; email: string; password: string }) {
		void signUp(values, {
			onSuccess: ([expectedError]) => {
				if (expectedError === EmailNotAvailableError) {
					form.setError('email', { type: EmailNotAvailableError })
				}
			},
		})
	}

	const isAnySignInPending = useSpinDelay(
		isEmailSignUpPending || isSocialSignInPending,
	)

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex flex-col items-center justify-center gap-2">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<DatabaseZap />
					</div>
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.soft_ago_pelican_hush()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-center text-sm">
					<span className="text-muted-foreground">
						{m.level_every_marten_spark()}{' '}
					</span>
					<Link
						to="/login"
						className="font-medium text-primary hover:underline"
					>
						{m.noble_acidic_niklas_tend()}
					</Link>
				</div>
				<LoadingButton
					variant="outline"
					className="w-full"
					loading={isAnySignInPending}
					Icon={GithubIcon}
					onClick={async () => {
						signInWithSocial({
							provider: 'github',
							callbackURL: '/dashboard',
						})
					}}
				>
					<span className="flex items-center">
						{m.aloof_direct_worm_trim()}
					</span>
				</LoadingButton>

				<Form {...form}>
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-card px-2 text-muted-foreground">
								{m.warm_quick_mole_stare()}
							</span>
						</div>
					</div>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						noValidate
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.giant_awake_crow_forgive()}</FormLabel>
									<FormControl>
										<Input
											placeholder={m.civil_late_poodle_race()}
											{...field}
										/>
									</FormControl>
									<FormMessage>{m.gray_brief_pug_jump()}</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel>{m.tame_next_lobster_succeed()}</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder={m.curly_fair_racoon_honor()}
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{fieldState.error?.type === EmailNotAvailableError
											? m.wise_green_jackdaw_prosper()
											: m.patchy_direct_ocelot_burn()}
									</FormMessage>
								</FormItem>
							)}
						/>
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
									<FormMessage>
										{m.close_mild_lemur_scoop({ length: 8 })}
									</FormMessage>
								</FormItem>
							)}
						/>
						<div className="pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isAnySignInPending}
								Icon={CirclePlus}
								iconPosition="right"
							>
								<span className="flex items-center">
									{m.least_raw_zebra_dine()}
								</span>
							</LoadingButton>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
