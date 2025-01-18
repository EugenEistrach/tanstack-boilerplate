import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import * as v from 'valibot'
import { Button, LoadingButton } from '@/components/ui/button'
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

import { useCompleteOnboardingMutation } from '@/features/onboarding/api/onboarding.api'
import { useAuth } from '@/lib/client/auth.client'

import * as m from '@/lib/paraglide/messages'

const onboardingFormSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1)),
	favoriteColor: v.pipe(v.string(), v.minLength(1)),
	redirectTo: v.optional(v.string()),
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

	const completeOnboardingMutation = useCompleteOnboardingMutation()

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
												defaultValue={auth.user.name}
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
												defaultValue=""
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<CardFooter>
								<LoadingButton
									type="submit"
									className="w-full"
									disabled={isPending}
									loading={isPending}
								>
									{m.complete_onboarding()}
								</LoadingButton>
							</CardFooter>
						</CardContent>
					</form>
				</Form>
			</Card>
		</div>
	)
}
