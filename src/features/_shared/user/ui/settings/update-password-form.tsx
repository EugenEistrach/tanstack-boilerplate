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

import { usePasswordUpdateMutation } from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

export function UpdatePasswordForm() {
	const form = useForm({
		resolver: arktypeResolver(
			type({
				currentPassword: 'string >= 8',
				newPassword: 'string >= 8',
			}),
		),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
		},
	})

	const passwordUpdateMutation = usePasswordUpdateMutation()
	const isPending = useSpinDelay(passwordUpdateMutation.isPending)

	return (
		<Card>
			<CardHeader>
				<CardTitle>{m.brave_wise_eagle_soar()}</CardTitle>
				<CardDescription>{m.swift_calm_hawk_glide()}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id="update-password-form"
						onSubmit={form.handleSubmit((values) =>
							passwordUpdateMutation.mutate(values),
						)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.warm_safe_deer_jump()}</FormLabel>
									<FormControl>
										<PasswordInput {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
					form="update-password-form"
					disabled={form.formState.isValidating || isPending}
					loading={isPending}
					Icon={Save}
				>
					{m.pink_spry_snake_hike()}
				</LoadingButton>
			</CardFooter>
		</Card>
	)
}
