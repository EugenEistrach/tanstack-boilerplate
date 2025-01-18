import { useQueryClient } from '@tanstack/react-query'
import { type UserWithRole } from 'better-auth/plugins'
import { MoreHorizontal, Ban, Key, UserCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { listUsersQueryOptions } from '@/features/admin/ui/users-list'
import { authClient, useAuth } from '@/lib/client/auth.client'
import * as m from '@/lib/paraglide/messages'

export const UserActions = ({ user }: { user: UserWithRole }) => {
	const { user: currentUser } = useAuth()
	const queryClient = useQueryClient()

	const handleBanUnban = async () => {
		if (user.banned) {
			const result = await authClient.admin.unbanUser({ userId: user.id })

			if (result.error) {
				toast.error(result.error.message)
			}
		} else {
			const result = await authClient.admin.banUser({ userId: user.id })

			if (result.error) {
				toast.error(result.error.message)
			}
		}
		await queryClient.invalidateQueries(listUsersQueryOptions())
	}

	const handleRevokeAllSessions = async () => {
		const result = await authClient.admin.revokeUserSessions({
			userId: user.id,
		})

		if (result.error) {
			toast.error(result.error.message)
		} else {
			toast.success('Sessions revoked')
		}

		await queryClient.invalidateQueries(listUsersQueryOptions())
	}

	const handleImpersonate = async () => {
		const result = await authClient.admin.impersonateUser({
			userId: user.id,
		})

		if (result.error) {
			toast.error(result.error.message)
		}

		window.location.reload()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-8 w-8 p-0"
					disabled={user.id === currentUser.id}
				>
					<span className="sr-only">{m.user_actions_menu()}</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{m.user_actions()}</DropdownMenuLabel>
				<DropdownMenuItem onClick={handleBanUnban}>
					<Ban className="mr-2 h-4 w-4" />
					{user.banned ? m.user_unban() : m.user_ban()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleRevokeAllSessions}>
					<Key className="mr-2 h-4 w-4" />
					{m.revoke_all_sessions()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleImpersonate}>
					<UserCircle className="mr-2 h-4 w-4" />
					{m.impersonate_user()}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
