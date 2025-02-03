import { arktypeResolver } from '@hookform/resolvers/arktype'
import { useMutation } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { type } from 'arktype'
import { CheckCircle2, DatabaseZap, KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import { authClient } from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

function ResetPasswordSuccess() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
					<CheckCircle2 className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.reset_password_email_sent_title()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4 text-center text-sm text-muted-foreground">
					<p>{m.reset_password_email_sent_description()}</p>
					<p className="text-xs">{m.reset_password_email_sent_note()}</p>
				</div>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">{m.reset_password_return_to_login()}</Link>
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

	const resetPasswordMutation = useMutation({
		mutationFn: async (values: { password: string }) => {
			const result = await authClient.resetPassword({
				token,
				newPassword: values.password,
			})
			if (result.error) {
				throw result.error
			}
			return result
		},
		onError: (error) => {
			toast.error(error.message || m.error_generic())
		},
	})

	async function onSubmit(values: { password: string }) {
		resetPasswordMutation.mutate(values)
	}

	if (resetPasswordMutation.isSuccess) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
						<CheckCircle2 className="h-6 w-6" />
					</div>
					<CardTitle className="text-center text-2xl font-bold">
						{m.reset_password_success()}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-sm text-muted-foreground">
						{m.reset_password_success_description()}
					</p>
					<div className="flex justify-center">
						<Button asChild>
							<Link to="/login">{m.reset_password_success_login()}</Link>
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
					{m.new_password_title()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					{m.new_password_subtitle()}
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.register_password_label()}</FormLabel>
									<FormControl>
										<PasswordInput
											placeholder={m.register_password_placeholder()}
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
								loading={resetPasswordMutation.isPending}
							>
								{m.new_password_button()}
							</LoadingButton>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

export function ResetPasswordForm() {
	const search = useSearch({ from: '/(auth)/reset-password' })

	const form = useForm({
		resolver: arktypeResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const resetPasswordMutation = useMutation({
		mutationFn: async (values: { email: string }) => {
			const result = await authClient.forgetPassword({
				email: values.email,
				redirectTo: '/reset-password',
			})
			if (result.error) {
				throw result.error
			}
			return result
		},
		onError: (error) => {
			toast.error(error.message || m.error_generic())
		},
	})

	async function onSubmit(values: { email: string }) {
		resetPasswordMutation.mutate(values)
	}

	if (search.token) {
		return <NewPasswordForm token={search.token} />
	}

	if (resetPasswordMutation.isSuccess) {
		return <ResetPasswordSuccess />
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<DatabaseZap className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					{m.reset_password_title()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					{m.reset_password_subtitle()}
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.register_email_label()}</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder={m.register_email_placeholder()}
											{...field}
										/>
									</FormControl>
									<FormMessage>{m.validation_email()}</FormMessage>
								</FormItem>
							)}
						/>
						<div className="pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={resetPasswordMutation.isPending}
							>
								{m.reset_password_button()}
							</LoadingButton>
						</div>
					</form>
				</Form>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">{m.reset_password_back()}</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
