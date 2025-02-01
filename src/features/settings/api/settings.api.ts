import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { type } from 'arktype'
import { toast } from 'sonner'
import { updateName } from '@/features/settings/domain/settings.server'
import * as m from '@/lib/paraglide/messages'
import { requireAuthSession } from '@/lib/server/auth.server'

export const useUpdateNameMutation = () => {
	const router = useRouter()
	return useMutation({
		mutationFn: $updateName,
		onSuccess: async () => {
			await router.invalidate()
			toast.success(m.profile_update_success())
		},
	})
}

const $updateName = createServerFn({ method: 'POST' })
	.validator(type({ name: 'string >= 1' }))
	.handler(async ({ data: { name } }) => {
		const { user } = await requireAuthSession()
		await updateName(user.id, name)
		return { success: true }
	})
