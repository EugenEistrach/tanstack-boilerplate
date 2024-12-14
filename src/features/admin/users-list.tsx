import { queryOptions, useQuery } from '@tanstack/react-query'

import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { authClient } from '@/lib/dd/auth.client'
import * as m from '@/lib/paraglide/messages'

export const listUsersQueryOptions = () =>
	queryOptions({
		queryKey: ['users'],
		queryFn: () =>
			authClient.admin.listUsers({
				query: {
					limit: 100,
					offset: 0,
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
