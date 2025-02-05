import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { LoadingButton } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import PasswordInput from '@/components/ui/input'

import { usePasswordSetRequestMutation } from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

export function SetPasswordForm() {
	const form = useForm({
		resolver: arktypeResolver(
			type({
				newPassword: 'string >= 8',
			}),
		),
		defaultValues: {
			newPassword: '',
		},
	})

	const passwordSetMutation = usePasswordSetRequestMutation()
	const isPending = useSpinDelay(passwordSetMutation.isPending)

	return (
		<Card>
			<CardHeader>
				<CardTitle>{m.fierce_happy_lion_roar()}</CardTitle>
				<CardDescription>{m.quick_smart_tiger_leap()}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id="set-password-form"
						onSubmit={form.handleSubmit((values) =>
							passwordSetMutation.mutate(values),
						)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.blue_proud_swan_float()}</FormLabel>
									<FormControl>
										<PasswordInput {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-end bg-muted/50 pt-6">
				<LoadingButton
					type="submit"
					form="set-password-form"
					disabled={form.formState.isValidating || isPending}
					loading={isPending}
					Icon={Save}
				>
					{m.neat_quick_fox_dance()}
				</LoadingButton>
			</CardFooter>
		</Card>
	)
}
