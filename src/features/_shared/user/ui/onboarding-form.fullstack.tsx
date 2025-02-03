import { arktypeResolver } from '@hookform/resolvers/arktype'
import { useSearch } from '@tanstack/react-router'
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

export function OnboardingForm() {
	const auth = useAuth()
	const { redirectTo } = useSearch({ from: '/_auth/onboarding' })

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
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-center text-2xl font-bold">
					{m.full_house_lion_zoom()}
				</CardTitle>
				<CardDescription className="text-center">
					{m.weird_every_snail_hope()}
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
									<FormLabel>{m.silly_wide_cod_absorb()}</FormLabel>
									<FormControl>
										<Input
											placeholder={m.quick_whole_shell_bubble()}
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
									<FormLabel>{m.equal_small_yak_approve()}</FormLabel>
									<FormControl>
										<Input
											placeholder={m.wild_sweet_elephant_roar()}
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
								{m.key_full_swallow_fry()}
							</LoadingButton>
						</CardFooter>
					</CardContent>
				</form>
			</Form>
		</Card>
	)
}
