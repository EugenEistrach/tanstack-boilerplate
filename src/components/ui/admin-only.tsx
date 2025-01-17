import { useAuth } from '@/lib/client/auth.client'

export function AdminOnly({ children }: { children: React.ReactNode }) {
	const { user } = useAuth()

	if (user.role !== 'admin') {
		return null
	}

	return children
}
