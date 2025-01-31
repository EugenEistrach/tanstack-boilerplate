import { getCookie, setCookie } from '@tanstack/start/server'

import { env } from '@/lib/server/env.server'

class PreferenceCookie<T> {
	private name: string

	constructor(name: string) {
		this.name = name
	}

	get() {
		const cookie = getCookie(this.name)

		if (!cookie) {
			return undefined
		}

		return JSON.parse(cookie) as T
	}

	set(value: T | undefined) {
		setCookie(this.name, JSON.stringify(value), {
			domain: new URL(env.APPLICATION_URL).hostname,
			secure: env.NODE_ENV === 'production',
			httpOnly: true,
			sameSite: 'lax',
		})
	}
}

export const sidebarOpenCookie = new PreferenceCookie<boolean>(
	'pref-sidebar-open',
)
export const themeCookie = new PreferenceCookie<string>('pref-theme')
