import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'

import { useAuth } from '@/features/_shared/user/api/auth.api'
import { useUpdateNameMutation } from '@/features/_shared/user/api/settings.api'
import * as m from '@/lib/paraglide/messages'

export function PersonalInformationForm() {
	const { user } = useAuth()

	const form = useForm({
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
		<Card>
			<CardHeader>
				<CardTitle>{m.jolly_brave_koala_dance()}</CardTitle>
				<CardDescription>{m.witty_calm_panda_dream()}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id="personal-information-form"
						onSubmit={form.handleSubmit((values) =>
							updateNameMutation.mutate({ data: values }),
						)}
						className="space-y-4"
					>
						<div className="space-y-1">
							<FormLabel>{m.proud_warm_snake_glow()}</FormLabel>
							<div className="flex items-center gap-4">
								<Avatar className="h-9 w-9">
									<AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
									<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
								</Avatar>
								{/* TODO: Add avatar upload */}
								{/* <LoadingButton variant="outline" size="sm" loading={false}>
												{m.proud_neat_swan_float()}
											</LoadingButton> */}
							</div>
						</div>
						<div className="space-y-1">
							<FormLabel>{m.green_such_alligator_commend()}</FormLabel>
							<Input value={user.email} disabled />
						</div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{m.silly_wide_cod_absorb()}</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-end bg-muted/50 pt-6">
				<LoadingButton
					form="personal-information-form"
					type="submit"
					disabled={form.formState.isValidating || isPending}
					loading={isPending}
					Icon={Save}
				>
					{m.pink_spry_snake_hike()}
				</LoadingButton>
			</CardFooter>
		</Card>
	)
}
