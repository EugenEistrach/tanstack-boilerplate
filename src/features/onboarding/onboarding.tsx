import { valibotResolver } from '@hookform/resolvers/valibot'
import { useMutation } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'

import { eq } from 'drizzle-orm'
import { Form, useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import * as v from 'valibot'
import { getWebRequest } from 'vinxi/http'
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
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'
import { OnboardingInfoTable } from '@/drizzle/schemas/onboarding-schema'
import { $requireAuthSession, useAuth } from '@/lib/auth.client'
import { env } from '@/lib/env'
import { validationClient } from '@/lib/functions'
import * as m from '@/lib/paraglide/messages'

const onboardingFormSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1)),
	favoriteColor: v.pipe(v.string(), v.minLength(1)),
	redirectTo: v.optional(v.string()),
})

export const $getOnboardingInfo = createServerFn('GET', async () => {
	const auth = await $requireAuthSession()

	const onboardingInfo = db
		.select()
		.from(OnboardingInfoTable)
		.where(eq(OnboardingInfoTable.userId, auth.user.id))
		.get()

	if (!onboardingInfo) {
		return null
	}

	return onboardingInfo
})

export const $requireOnboardingInfo = createServerFn('GET', async () => {
	const onboardingInfo = await $getOnboardingInfo()
	const request = getWebRequest()

	if (!onboardingInfo) {
		throw redirect({
			to: '/onboarding',
			search: { redirectTo: new URL(request.url).pathname },
		})
	}
	return onboardingInfo
})

export const $completeOnboarding = createServerFn(
	'POST',

	validationClient
		.input(onboardingFormSchema)
		.handler(async ({ parsedInput: { name, favoriteColor, redirectTo } }) => {
			const { user } = await $requireAuthSession()

			await db.transaction(async (tx) => {
				await tx
					.update(UserTable)
					.set({
						name,
						role: env.ADMIN_USER_EMAILS.includes(user.email) ? 'admin' : 'user',
					})
					.where(eq(UserTable.id, user.id))

				await tx.insert(OnboardingInfoTable).values({
					userId: user.id,
					favoriteColor,
				})
			})

			throw redirect({
				to: redirectTo || '/dashboard',
			})
		}),
)

export function OnboardingForm({ redirectTo }: { redirectTo?: string }) {
	const auth = useAuth()

	const form = useForm<v.InferOutput<typeof onboardingFormSchema>>({
		resolver: valibotResolver(onboardingFormSchema),
		defaultValues: {
			name: auth.user.name,
			favoriteColor: '',
			redirectTo,
		},
	})

	const completeOnboardingMutation = useMutation({
		mutationFn: useServerFn($completeOnboarding),
	})

	const isPending = useSpinDelay(completeOnboardingMutation.isPending)

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold">
						{m.onboarding_title()}
					</CardTitle>
					<CardDescription className="text-center">
						{m.onboarding_description()}
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => {
							void completeOnboardingMutation.mutateAsync(values)
						})}
						className="space-y-8"
					>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.onboarding_name_label()}</FormLabel>
										<FormControl>
											<Input
												placeholder={m.onboarding_name_placeholder()}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="favoriteColor"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{m.onboarding_color_label()}</FormLabel>
										<FormControl>
											<Input
												placeholder={m.onboarding_color_placeholder()}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<CardFooter>
								<Button type="submit" className="w-full" disabled={isPending}>
									{isPending ? m.loading() : m.complete_onboarding()}
								</Button>
							</CardFooter>
						</CardContent>
					</form>
				</Form>
			</Card>
		</div>
	)
}
