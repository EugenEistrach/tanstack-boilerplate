import { useSession } from 'vinxi/http'
import { serverEnv } from './env.server'
import { type supportedLocales } from './i18n'

interface Session {
	locale?: (typeof supportedLocales)[number]['locale']
	timeZone?: string
	redirectTo?: string
}

export async function getVinxiSession() {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const session = await useSession<Session>({
		password: serverEnv.SESSION_SECRET,
	})

	return session
}
