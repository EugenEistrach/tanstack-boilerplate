import { queryOptions, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'use-intl'

import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { authClient } from '@/lib/auth.client'

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
	const t = useTranslations()

	if (isLoading) return <div>{t('common.loading')}</div>
	if (isError) return <div>{t('error.generic')}</div>

	return (
		<div className="">
			<DataTable columns={columns} data={data?.data?.users || []} />
		</div>
	)
}
