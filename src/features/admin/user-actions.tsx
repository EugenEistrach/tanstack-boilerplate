import { type UserWithRole } from 'better-auth/plugins'
import { MoreHorizontal, Ban, Key, UserCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/client/auth.client'
import * as m from '@/lib/paraglide/messages'

export const UserActions = ({ user }: { user: UserWithRole }) => {
	const { user: currentUser } = useAuth()

	const handleBanUnban = () => {
		console.log(`${user.banned ? 'Unban' : 'Ban'} user:`, user.id)
		// TODO: Implement ban/unban functionality
	}

	const handleRevokeAllSessions = () => {
		console.log('Revoke all sessions for user:', user.id)
		// TODO: Implement revoke all sessions functionality
	}

	const handleImpersonate = () => {
		console.log('Impersonate user:', user.id)
		// TODO: Implement impersonate functionality
	}

	const handleRemoveUser = () => {
		console.log('Remove user:', user.id)
		// TODO: Implement remove user functionality
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
				<DropdownMenuItem onClick={handleRemoveUser}>
					<Trash2 className="mr-2 h-4 w-4" />
					{m.remove_user()}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
