import { valibotResolver } from '@hookform/resolvers/valibot'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { eq } from 'drizzle-orm'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSpinDelay } from 'spin-delay'
import * as v from 'valibot'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { FieldErrorMessage } from '@/components/ui/field-error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { H1, H2, Subtitle } from '@/components/ui/typography'

import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas'
import { $requireAuthSession, useAuth } from '@/lib/auth.client'
import { validationClient } from '@/lib/functions'
import * as m from '@/lib/paraglide/messages'

const updateNameSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty()),
})

const $updateName = createServerFn(
	'POST',
	validationClient
		.input(updateNameSchema)
		.handler(async ({ parsedInput: { name } }) => {
			const { user } = await $requireAuthSession()
			await db.update(UserTable).set({ name }).where(eq(UserTable.id, user.id))
			return { success: true }
		}),
)

export const Route = createFileRoute('/dashboard/settings/')({
	component: () => <Settings />,
})

function Settings() {
	const { user } = useAuth()
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors, isValidating },
	} = useForm({
		resolver: valibotResolver(updateNameSchema),
		defaultValues: {
			name: user.name || '',
		},
	})

	const updateNameMutation = useMutation({
		mutationFn: useServerFn($updateName),
		onSuccess: async () => {
			await router.invalidate()
		},
	})

	const onSubmit = (data: v.InferOutput<typeof updateNameSchema>) => {
		updateNameMutation.mutate(data)
		toast.success(m.profile_update_success())
	}

	const isPending = useSpinDelay(updateNameMutation.isPending)

	return (
		<div className="space-y-6">
			<div>
				<H1>{m.settings_title()}</H1>
				<Subtitle>{m.low_sad_martin_walk()}</Subtitle>
			</div>

			<Card className="max-w-3xl">
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>
						<H2>{m.update_profile()}</H2>
					</CardHeader>
					<CardContent className="p-6">
						<div className="flex items-start space-x-6">
							<Avatar className="h-20 w-20">
								<AvatarImage src={user.image} alt={user.name} />
								<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex-grow space-y-4">
								<div className="space-y-1">
									<Label htmlFor="email">{m.email()}</Label>
									<Input id="email" value={user.email} disabled />
								</div>
								<div className="space-y-1">
									<Label htmlFor="name">{m.onboarding_name_label()}</Label>
									<Input id="name" {...register('name')} />
									<FieldErrorMessage error={errors.name} />
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="px-6 py-4">
						<Button
							type="submit"
							disabled={isValidating || isPending}
							className="ml-auto"
						>
							{isPending ? m.loading() : m.save_changes()}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
