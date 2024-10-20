import { useMutation } from '@tanstack/react-query'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { createTranslator } from 'use-intl'
import { getHeader, useSession } from 'vinxi/http'
import { env } from './env'
import { getSession } from './session'

export const supportedLocales = ['en', 'de'] as const
export const defaultLocale = 'en'
export const defaultTimeZone = 'Europe/Berlin'

const messages = await import(`./i18n/${defaultLocale}.json`)

export const getI18n = createServerFn('GET', async () => {
	const session = await getSession()

	let locale = session.data['locale']
	let timeZone = session.data['timeZone']

	if (!locale) {
		const header = getHeader('Accept-Language')
		const languages = header?.split(',') ?? []
		locale =
			supportedLocales.find((lang) => languages.includes(lang)) ?? defaultLocale

		await session.update({
			locale,
		})
	}

	if (!timeZone) {
		await session.update({
			timeZone: defaultTimeZone,
		})
		timeZone = defaultTimeZone
	}

	return {
		locale,
		timeZone,
		messages,
	}
})

export const setLocaleInSession = createServerFn(
	'POST',
	async (locale: (typeof supportedLocales)[number]) => {
		const session = await useSession({
			password: env.SESSION_SECRET,
		})

		await session.update({
			locale,
		})
	},
)

export const setTimeZoneInSession = createServerFn(
	'POST',
	async (timeZone: string) => {
		const session = await useSession({
			password: env.SESSION_SECRET,
		})

		await session.update({
			timeZone,
		})
	},
)

export const getTranslations = async () => {
	const { locale, timeZone, messages } = await getI18n()

	const t = createTranslator({
		locale,
		timeZone,
		messages,
	})

	return t
}

export const useCurrentLocale = () => {
	const context = useRouteContext({ from: '__root__' })
	return context.locale
}

export const useCurrentTimeZone = () => {
	const context = useRouteContext({ from: '__root__' })
	return context.timeZone
}

export const useChangeLocaleMutation = () => {
	const router = useRouter()

	return useMutation({
		mutationFn: useServerFn(setLocaleInSession),
		onSuccess: () => {
			void router.invalidate()
		},
	})
}

export type Translator = Awaited<ReturnType<typeof getTranslations>>
export type TranslatorKeys = Parameters<Translator>[0]
export const tk = <TKey extends TranslatorKeys>(key: TKey): TKey => {
	return key
}
