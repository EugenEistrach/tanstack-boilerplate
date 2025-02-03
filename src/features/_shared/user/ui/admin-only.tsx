import { useAuth } from '@/features/_shared/user/api/auth.api'

export function AdminOnly({ children }: { children: React.ReactNode }) {
	const { user } = useAuth()

	if (user.role !== 'admin') {
		return null
	}

	return children
}
