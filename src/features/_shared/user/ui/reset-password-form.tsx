import { arktypeResolver } from '@hookform/resolvers/arktype'
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
import { Input } from '@/components/ui/input'
import * as m from '@/lib/paraglide/messages'

const resetPasswordSchema = type({
	email: 'string.email >= 1',
})

export function ResetPasswordForm() {
	const form = useForm({
		resolver: arktypeResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	function onSubmit(values: { email: string }) {
		console.log('Reset password form submitted:', values)
	}

	return (
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
					<LoadingButton type="submit" className="w-full" loading={false}>
						{m.reset_password_button()}
					</LoadingButton>
				</div>
			</form>
		</Form>
	)
}
