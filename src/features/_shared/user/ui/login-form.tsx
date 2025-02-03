import { arktypeResolver } from '@hookform/resolvers/arktype'
import { Link, useNavigate } from '@tanstack/react-router'
import { type } from 'arktype'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@/components/ui/button'
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
					<LoadingButton type="submit" className="w-full" loading={false}>
						{m.jumpy_spry_snake_scoop()}
					</LoadingButton>
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
				</div>
			</form>
		</Form>
	)
}
