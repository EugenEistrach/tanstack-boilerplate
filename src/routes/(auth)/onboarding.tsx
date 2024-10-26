import { valibotResolver } from '@hookform/resolvers/valibot'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import * as v from 'valibot'

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

import {
	$completeOnboarding,
	$getOnboardingInfo,
} from '@/features/onboarding/onboarding'
import { useAuth } from '@/lib/auth.client'
import * as m from '@/lib/paraglide/messages'

const formSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1, m.name_required)),
	favoriteColor: v.pipe(v.string(), v.minLength(1, m.east_patchy_mantis_hurl)),
})

export const Route = createFileRoute('/(auth)/onboarding')({
	validateSearch: v.object({
		redirectTo: v.optional(v.string()),
	}),
	beforeLoad: async ({ context, search }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: search.redirectTo,
				},
			})
		}

		const onboardingInfo = await $getOnboardingInfo()

		if (onboardingInfo) {
			throw redirect({
				to: search.redirectTo || '/dashboard',
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
	const auth = useAuth()

	const form = useForm<v.InferOutput<typeof formSchema>>({
		resolver: valibotResolver(formSchema),
		defaultValues: {
			name: auth.user.name,
			favoriteColor: '',
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
							void completeOnboardingMutation.mutateAsync({
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
