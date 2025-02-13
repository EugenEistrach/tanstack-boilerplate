import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { type } from 'arktype'
import { toast } from 'sonner'
import { requireAuthSession } from '@/features/_shared/user/domain/auth.server'
import { updateName } from '@/features/_shared/user/domain/settings.server'
import * as m from '@/lib/paraglide/messages'

export const useUpdateNameMutation = () => {
	const router = useRouter()
	return useMutation({
		mutationFn: $updateName,
		onSuccess: async () => {
			await router.invalidate()
			toast.success(m.main_heavy_donkey_win())
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
