import { useSession } from 'vinxi/http'
import { env } from './env'

interface Session {
	redirectTo?: string
}

export async function getVinxiSession() {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const session = await useSession<Session>({
		password: env.SESSION_SECRET,
	})

	return session
}
