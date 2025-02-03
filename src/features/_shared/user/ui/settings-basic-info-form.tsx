import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingButton } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { FieldErrorMessage } from '@/components/ui/field-error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { H2 } from '@/components/ui/typography'

import { useAuth } from '@/features/_shared/user/api/auth.api'
import { useUpdateNameMutation } from '@/features/_shared/user/api/settings.api'
import * as m from '@/lib/paraglide/messages'

export function SettingsBasicInfoForm() {
	const { user } = useAuth()

	const {
		register,
		handleSubmit,
		formState: { errors, isValidating },
	} = useForm({
		resolver: arktypeResolver(
			type({
				name: 'string >= 1',
			}),
		),
		defaultValues: {
			name: user.name || '',
		},
	})

	const updateNameMutation = useUpdateNameMutation()

	const isPending = useSpinDelay(updateNameMutation.isPending)
	return (
		<Card className="max-w-3xl">
			<form
				onSubmit={handleSubmit((data) => updateNameMutation.mutate({ data }))}
			>
				<CardHeader>
					<H2>{m.round_silly_cowfish_pride()}</H2>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-start space-x-6">
						<Avatar className="h-20 w-20">
							<AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
							<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="flex-grow space-y-4">
							<div className="space-y-1">
								<Label htmlFor="email">{m.green_such_alligator_commend()}</Label>
								<Input id="email" value={user.email} disabled />
							</div>
							<div className="space-y-1">
								<Label htmlFor="name">{m.silly_wide_cod_absorb()}</Label>
								<Input
									id="name"
									{...register('name')}
									defaultValue={user.name}
								/>
								<FieldErrorMessage error={errors.name} />
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className="px-6 py-4">
					<LoadingButton
						type="submit"
						disabled={isValidating || isPending}
						loading={isPending}
						className="ml-auto"
					>
						{m.pink_spry_snake_hike()}
					</LoadingButton>
				</CardFooter>
			</form>
		</Card>
	)
}
