import { type ColumnDef } from '@tanstack/react-table'
import { type UserWithRole } from 'better-auth/plugins'
import { UserActions } from './user-actions'
import { UserRoleSwitch } from './user-role-switch'

export const columns: ColumnDef<UserWithRole>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'role',
		header: 'Admin',
		cell: ({ row }) => <UserRoleSwitch user={row.original} />,
	},
	{
		accessorKey: 'banned',
		header: 'Banned',
		cell: ({ row }) => <span>{row.original.banned ? 'Yes' : 'No'}</span>,
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => (
			<span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => <UserActions user={row.original} />,
	},
]
