import { arktypeResolver } from '@hookform/resolvers/arktype'
import { Link } from '@tanstack/react-router'
import { type } from 'arktype'
import { DatabaseZap } from 'lucide-react'
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
	useEmailSignUp,
	useSocialSignIn,
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

	const { mutate: signUp, isPending: isEmailSignUpPending } = useEmailSignUp()
	const { mutate: signInWithSocial, isPending: isSocialSignInPending } =
		useSocialSignIn()

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
				<Button
					variant="outline"
					className="w-full"
					disabled={isAnySignInPending}
					onClick={async () => {
						signInWithSocial({
							provider: 'github',
							callbackURL: '/dashboard',
						})
					}}
				>
					<span className="flex items-center">
						<svg
							className="mr-2 h-4 w-4"
							viewBox="0 0 256 250"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							stroke="currentColor"
							preserveAspectRatio="xMidYMid"
							aria-hidden="true"
						>
							<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
						</svg>
						{m.aloof_direct_worm_trim()}
					</span>
				</Button>

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
