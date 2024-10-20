import { useSession } from 'vinxi/http'
import { env } from './env'
import { type supportedLocales } from './i18n'

interface Session {
	locale?: (typeof supportedLocales)[number]['locale']
	timeZone?: string
}

export async function getSession() {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const session = await useSession<Session>({
		password: env.SESSION_SECRET,
	})

	return session
}
