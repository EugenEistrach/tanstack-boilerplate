import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { createTranslator } from 'use-intl'
import { getHeader, useSession } from 'vinxi/http'
import { $getHints } from './client-hints'
import { env } from './env'
import { getVinxiSession } from './session.server'

export const supportedLocales = [
	{
		locale: 'en',
		label: 'English',
	},
	{
		locale: 'de',
		label: 'Deutsch',
	},
] as const

export const defaultLocale = 'en'

export const $getI18n = createServerFn('GET', async () => {
	const session = await getVinxiSession()

	if (!session.data['locale']) {
		const header = getHeader('Accept-Language')
		const languages = header?.split(',') ?? []
		const locale =
			supportedLocales.find((lang) => languages.includes(lang.locale))
				?.locale ?? defaultLocale

		await session.update({
			locale,
		})

		const messages = await loadMessages(locale)

		return {
			locale,
			messages,
		}
	}

	return {
		locale: session.data['locale'],
		messages: await loadMessages(session.data['locale']),
	}
})

export const $updateLocale = createServerFn(
	'POST',
	async (locale: SupportedLocale) => {
		const session = await useSession({
			password: env.SESSION_SECRET,
		})

		await session.update({
			locale,
		})
	},
)

export const getTranslations = async () => {
	const [{ locale, messages }, hints] = await Promise.all([
		$getI18n(),
		$getHints(),
	])

	return createTranslator({
		locale,
		timeZone: hints.timeZone,
		messages,
	})
}

export const useChangeLocaleMutation = () => {
	const router = useRouter()
	const changeLocaleMutation = useMutation({
		mutationFn: useServerFn($updateLocale),
		onSuccess: () => {
			void router.invalidate()
		},
	})
	return changeLocaleMutation
}

type NestedMessages = {
	[key: string]: string | NestedMessages
}

const loadMessages = async (locale: SupportedLocale) => {
	const flatMessages = await import(`../../i18n/${locale}.json`)
	const messages = Object.entries(flatMessages.default).reduce(
		(acc: NestedMessages, [key, value]) => {
			const keys = key.split('.')
			let current: NestedMessages = acc
			for (let i = 0; i < keys.length - 1; i++) {
				const k = keys[i]
				if (k && !(k in current)) {
					current[k] = {}
				}
				current = k ? (current[k] as NestedMessages) : acc
			}
			const lastKey = keys[keys.length - 1]
			if (lastKey) {
				current[lastKey] = value as string
			}
			return acc
		},
		{} as NestedMessages,
	)
	return messages as any
}

export type SupportedLocale = (typeof supportedLocales)[number]['locale']
export type Translator = Awaited<ReturnType<typeof getTranslations>>
export type TranslatorKeys = Parameters<Translator>[0]
export const tk = <TKey extends TranslatorKeys>(key: TKey): TKey => {
	return key
}
