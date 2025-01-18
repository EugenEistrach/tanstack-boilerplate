import { queryOptions, useQuery } from '@tanstack/react-query'

import { type ColumnDef } from '@tanstack/react-table'
import { type UserWithRole } from 'better-auth/plugins'

import { DataTable } from '@/components/data-table'
import { UserActions } from '@/features/admin/ui/user-actions'
import { UserRoleSwitch } from '@/features/admin/ui/user-role-switch'

import { authClient } from '@/lib/client/auth.client'
import * as m from '@/lib/paraglide/messages'

export const columns: ColumnDef<UserWithRole>[] = [
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'name',
		header: 'Name',
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

export const listUsersQueryOptions = () =>
	queryOptions({
		queryKey: ['users'],
		queryFn: () =>
			authClient.admin.listUsers({
				query: {
					limit: 100,
					offset: 0,
					sortBy: 'email',
				},
			}),
	})

export function UsersList() {
	const { data, isLoading, isError } = useQuery(listUsersQueryOptions())

	if (isLoading) return <div>{m.loading()}</div>
	if (isError) return <div>{m.error_generic()}</div>

	return (
		<div className="">
			<DataTable columns={columns} data={data?.data?.users || []} />
		</div>
	)
}
