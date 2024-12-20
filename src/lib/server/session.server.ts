import { useSession } from 'vinxi/http'
import { env } from '@/lib/server/env.server'

interface Session {
	redirectTo?: string
	sidebarOpen?: boolean
	theme?: 'light' | 'dark'
}

export async function getVinxiSession() {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const session = await useSession<Session>({
		password: env.SESSION_SECRET,
	})

	return session
}
