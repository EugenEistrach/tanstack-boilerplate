import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { eq } from 'drizzle-orm'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas'
import { $requireAuthSession } from '@/lib/auth.client'
import { validationClient } from '@/lib/functions'

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Name is required.',
	}),
})

const $updateUser = createServerFn(
	'POST',

	validationClient
		.input(
			formSchema.extend({
				redirectTo: z.string().optional(),
			}),
		)
		.handler(async ({ parsedInput: { name, redirectTo } }) => {
			const { user } = await $requireAuthSession()

			await db.transaction(async (tx) => {
				await tx
					.update(UserTable)
					.set({
						name,
					})
					.where(eq(UserTable.id, user.id))
			})

			throw redirect({
				to: redirectTo || '/dashboard',
			})
		}),
)

export const Route = createFileRoute('/(auth)/onboarding')({
	validateSearch: z.object({
		redirectTo: z.string().optional(),
	}),
	beforeLoad: ({ context, search }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: search.redirectTo,
				},
			})
		}

		return {
			redirectTo: search.redirectTo,
		}
	},
	component: Onboarding,
})

function Onboarding() {
	const { redirectTo } = Route.useSearch()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	const updateUserMutation = useMutation({
		mutationFn: useServerFn($updateUser),
	})

	const isPending = useSpinDelay(updateUserMutation.isPending)

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold">
						Welcome Onboard!
					</CardTitle>
					<CardDescription className="text-center">
						Let's get to know you better
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => {
							const userTimeZone =
								Intl.DateTimeFormat().resolvedOptions().timeZone
							console.log(userTimeZone)
							void updateUserMutation.mutateAsync({
								...values,
								redirectTo,
							})
						})}
						className="space-y-8"
					>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>What's your name?</FormLabel>
										<FormControl>
											<Input placeholder="Enter your name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? 'Processing...' : 'Complete Onboarding'}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	)
}
