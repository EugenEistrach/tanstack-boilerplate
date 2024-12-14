import { valibotResolver } from '@hookform/resolvers/valibot'
import { useMutation } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'

import { useForm } from 'react-hook-form'
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
	Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
	completeOnboarding,
	getOnboardingInfo,
} from '@/features/onboarding/domain/onboarding.server'
import { $requireAuthSession, useAuth } from '@/lib/client/auth.client'

import * as m from '@/lib/paraglide/messages'

const onboardingFormSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1)),
	favoriteColor: v.pipe(v.string(), v.minLength(1)),
	redirectTo: v.optional(v.string()),
})

export const $getOnboardingInfo = createServerFn({ method: 'GET' }).handler(
	async () => {
		const { user } = await $requireAuthSession()
		return getOnboardingInfo(user.id)
	},
)

export const $requireOnboardingInfo = createServerFn({ method: 'GET' }).handler(
	async () => {
		const onboardingInfo = await $getOnboardingInfo()
		const request = getWebRequest()

		if (!onboardingInfo) {
			throw redirect({
				to: '/onboarding',
				search: { redirectTo: new URL(request.url).pathname },
			})
		}
		return onboardingInfo
	},
)

export const $completeOnboarding = createServerFn({ method: 'POST' })
	.validator(
		v.object({
			name: v.string(),
			favoriteColor: v.string(),
			redirectTo: v.optional(v.string()),
		}),
	)
	.handler(async ({ data: { name, favoriteColor, redirectTo } }) => {
		const { user } = await $requireAuthSession()

		completeOnboarding({
			userId: user.id,
			name,
			favoriteColor,
		})

		throw redirect({
			to: redirectTo || '/dashboard',
		})
	})

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
							void completeOnboardingMutation.mutateAsync({ data: values })
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
