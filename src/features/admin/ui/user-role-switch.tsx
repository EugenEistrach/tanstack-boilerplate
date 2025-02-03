import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type UserWithRole } from 'better-auth/plugins'
import { Switch } from '@/components/ui/switch'
import { authClient, useAuth } from '@/features/_shared/user/api/auth.api'
import { listUsersQueryOptions } from '@/features/admin/ui/users-list'

export const UserRoleSwitch = ({ user }: { user: UserWithRole }) => {
	const { user: currentUser } = useAuth()
	const queryClient = useQueryClient()

	const isAdmin = user.role === 'admin'

	const updateRoleMutation = useMutation({
		mutationFn: (setToAdmin: boolean) => {
			return authClient.admin.setRole({
				userId: user.id,
				role: setToAdmin ? 'admin' : 'user',
			})
		},
		onSuccess: () => {
			void queryClient.invalidateQueries(listUsersQueryOptions())
		},
	})

	const handleRoleChange = (checked: boolean) => {
		updateRoleMutation.mutate(checked)
	}

	return (
		<div className="flex items-center space-x-2">
			<Switch
				id={`role-switch-${user.id}`}
				checked={isAdmin}
				onCheckedChange={handleRoleChange}
				disabled={user.id === currentUser.id || updateRoleMutation.isPending}
			/>
		</div>
	)
}
