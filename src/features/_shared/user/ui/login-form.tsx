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
					message: m.password_or_username_incorrect(),
				})
				form.setError('password', {
					type: 'manual',
					message: m.password_or_username_incorrect(),
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
						{m.login_form_divider()}
					</span>
				</div>
			</div>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{m.login_username_label()}</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder={m.login_username_placeholder()}
									{...field}
								/>
							</FormControl>
							<FormMessage>
								{fieldState.error?.type === 'manual'
									? fieldState.error.message
									: m.validation_required()}
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
								<FormLabel>{m.login_password_label()}</FormLabel>
								<Link
									to="/reset-password"
									className="text-sm font-medium text-primary hover:underline"
								>
									{m.forgot_password_link()}
								</Link>
							</div>
							<FormControl>
								<PasswordInput
									placeholder={m.login_password_placeholder()}
									{...field}
								/>
							</FormControl>
							<FormMessage>
								{fieldState.error?.type === 'manual'
									? fieldState.error.message
									: m.validation_required()}
							</FormMessage>
						</FormItem>
					)}
				/>
				<div className="space-y-4 pt-4">
					<LoadingButton type="submit" className="w-full" loading={false}>
						{m.login_button()}
					</LoadingButton>
					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							{m.login_register_prompt()}{' '}
						</span>
						<Link
							to="/register"
							className="font-medium text-primary hover:underline"
						>
							{m.register_button()}
						</Link>
					</div>
				</div>
			</form>
		</Form>
	)
}
