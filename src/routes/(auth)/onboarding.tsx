import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { useTranslations } from 'use-intl'
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

import {
	$completeOnboarding,
	$getOnboardingInfo,
} from '@/features/onboarding/onboarding'
import { useAuth } from '@/lib/auth.client'

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Name is required.',
	}),
	favoriteColor: z.string().min(1, {
		message: 'Favorite color is required.',
	}),
})

export const Route = createFileRoute('/(auth)/onboarding')({
	validateSearch: z.object({
		redirectTo: z.string().optional(),
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
	const t = useTranslations()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
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
						{t('onboarding.title')}
					</CardTitle>
					<CardDescription className="text-center">
						{t('onboarding.description')}
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
										<FormLabel>{t('onboarding.nameLabel')}</FormLabel>
										<FormControl>
											<Input
												placeholder={t('onboarding.namePlaceholder')}
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
										<FormLabel>{t('onboarding.colorLabel')}</FormLabel>
										<FormControl>
											<Input
												placeholder={t('onboarding.colorPlaceholder')}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<CardFooter>
								<Button type="submit" className="w-full" disabled={isPending}>
									{isPending
										? t('common.loading')
										: t('onboarding.completeButton')}
								</Button>
							</CardFooter>
						</CardContent>
					</form>
				</Form>
			</Card>
		</div>
	)
}
