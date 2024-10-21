import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { createTranslator } from 'use-intl'
import { getHeader, useSession } from 'vinxi/http'
import { $getHints } from './client-hints'
import { serverEnv } from './env.server'
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

		const messages = await import(`../../i18n/${locale}.json`)

		return {
			locale,
			messages,
		}
	}

	return {
		locale: session.data['locale'],
		messages: await import(`../../i18n/${session.data['locale']}.json`),
	}
})

export const $updateLocale = createServerFn(
	'POST',
	async (locale: SupportedLocale) => {
		const session = await useSession({
			password: serverEnv.SESSION_SECRET,
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

export type SupportedLocale = (typeof supportedLocales)[number]['locale']
export type Translator = Awaited<ReturnType<typeof getTranslations>>
export type TranslatorKeys = Parameters<Translator>[0]
export const tk = <TKey extends TranslatorKeys>(key: TKey): TKey => {
	return key
}
