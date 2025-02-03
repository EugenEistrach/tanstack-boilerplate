import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { LoadingButton } from '@/components/ui/button'
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

import { useAuth } from '@/features/_shared/user/api/auth.api'
import { useCompleteOnboardingMutation } from '@/features/_shared/user/api/onboarding.api'

import * as m from '@/lib/paraglide/messages'

const onboardingFormSchema = type({
	name: 'string >= 1',
	favoriteColor: 'string >= 1',
	'redirectTo?': 'string | undefined',
})

export function OnboardingForm({ redirectTo }: { redirectTo?: string }) {
	const auth = useAuth()

	const form = useForm({
		resolver: arktypeResolver(onboardingFormSchema),
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
								<LoadingButton
									type="submit"
									className="w-full"
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
