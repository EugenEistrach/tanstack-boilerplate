import { arktypeResolver } from '@hookform/resolvers/arktype'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { type } from 'arktype'
import { DatabaseZap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { LoadingButton, Button } from '@/components/ui/button'
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
import { authClient } from '@/features/_shared/user/api/auth.api'
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
	const { redirectTo } = useSearch({ from: '/(auth)/login' })

	function onSubmit(values: { email: string; password: string }) {
		void authClient.signIn.email(values, {
			onSuccess: () => {
				void navigate({ to: '/dashboard' })
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
				<Button
					variant="outline"
					className="w-full"
					onClick={async () => {
						await authClient.signIn.social({
							provider: 'github',
							callbackURL: redirectTo ?? '/dashboard',
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
								variant="default"
								type="submit"
								className="w-full"
								loading={false}
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
