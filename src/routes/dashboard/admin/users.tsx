import { createFileRoute } from '@tanstack/react-router'
import { UsersList } from '@/features/admin/users-list'

export const Route = createFileRoute('/dashboard/admin/users')({
	component: UsersList,
})
