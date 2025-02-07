import { arktypeResolver } from '@hookform/resolvers/arktype'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { type } from 'arktype'
import { DatabaseZap, LockKeyholeOpen } from 'lucide-react'
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
	useEmailSignInMutation,
	useSocialSignInMutation,
} from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

const loginFormSchema = type({
	email: 'string >= 1 & string.email',
	password: 'string >= 1',
})

export function LoginForm() {
	const form = useForm({
		resolver: arktypeResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const navigate = useNavigate()
	const { redirectTo } = useSearch({ from: '/_auth/login' })
	const { mutate: signIn, isPending: isEmailSignInPending } =
		useEmailSignInMutation()
	const { mutate: signInWithSocial, isPending: isSocialSignInPending } =
		useSocialSignInMutation()

	function onSubmit(values: { email: string; password: string }) {
		void signIn(values, {
			onSuccess: ([expectedError]) => {
				if (expectedError === 'verification_required') {
					void navigate({
						to: '/verify-email',
						search: { email: values.email },
					})
				}
			},
			onError: () => {
				form.setError('email', {
					type: 'manual',
					message: m.weary_civil_bird_aid(),
				})
				form.setError('password', {
					type: 'manual',
					message: m.weary_civil_bird_aid(),
				})
			},
		})
	}

	const isAnySignInPending = useSpinDelay(
		isEmailSignInPending || isSocialSignInPending,
	)

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<DatabaseZap />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.minor_trick_buzzard_foster()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-center text-sm">
					<span className="text-muted-foreground">
						{m.kind_polite_moth_assure()}{' '}
					</span>
					<Link
						to="/register"
						className="font-medium text-primary hover:underline"
					>
						{m.least_raw_zebra_dine()}
					</Link>
				</div>
				<LoadingButton
					variant="outline"
					className="w-full"
					loading={isSocialSignInPending}
					Icon={GithubIcon}
					onClick={async () => {
						signInWithSocial({
							provider: 'github',
							callbackURL: redirectTo ?? '/dashboard',
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
								{m.cozy_icy_lark_dance()}
							</span>
						</div>
					</div>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel>{m.proof_gaudy_turtle_climb()}</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder={m.lime_lazy_shrike_strive()}
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{fieldState.error?.type === 'manual'
											? fieldState.error.message
											: m.gray_brief_pug_jump()}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field, fieldState }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel>{m.zany_fit_owl_learn()}</FormLabel>
										<Link
											to="/reset-password"
											className="text-sm font-medium text-primary hover:underline"
										>
											{m.polite_safe_bear_hint()}
										</Link>
									</div>
									<FormControl>
										<PasswordInput
											placeholder={m.alert_grassy_moose_absorb()}
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{fieldState.error?.type === 'manual'
											? fieldState.error.message
											: m.gray_brief_pug_jump()}
									</FormMessage>
								</FormItem>
							)}
						/>
						<div className="space-y-4 pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isAnySignInPending}
								Icon={LockKeyholeOpen}
								iconPosition="right"
							>
								{m.jumpy_spry_snake_scoop()}
							</LoadingButton>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
