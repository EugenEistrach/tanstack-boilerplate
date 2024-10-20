import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/start'
import { createTranslator } from 'use-intl'
import { getHeader, useSession } from 'vinxi/http'
import { env } from './env'
import { getSession } from './session'

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
export const defaultTimeZone = 'Europe/Berlin'

export const getI18n$ = createServerFn('GET', async () => {
	const session = await getSession()

	if (!session.data['locale']) {
		const header = getHeader('Accept-Language')
		const languages = header?.split(',') ?? []
		const locale =
			supportedLocales.find((lang) => languages.includes(lang.locale))
				?.locale ?? defaultLocale

		await session.update({
			locale,
		})

		const messages = await import(`../i18n/${locale}.json`)

		return {
			locale,
			messages,
		}
	}

	return {
		locale: session.data['locale'],
		messages: await import(`../i18n/${session.data['locale']}.json`),
	}
})

export const getTimeZone$ = createServerFn('GET', async () => {
	const session = await getSession()

	if (!session.data['timeZone']) {
		await session.update({
			timeZone: defaultTimeZone,
		})
		return defaultTimeZone
	}

	return session.data['timeZone']
})

export const updateLocale$ = createServerFn(
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

export const setTimeZoneInSession$ = createServerFn(
	'POST',
	async (timeZone: string) => {
		const session = await getSession()

		await session.update({
			timeZone,
		})
	},
)

export const getTranslations = async () => {
	const [{ locale, messages }, timeZone] = await Promise.all([
		getI18n$(),
		getTimeZone$(),
	])

	return createTranslator({
		locale,
		timeZone,
		messages,
	})
}

export const getI18nQueryOptions = () =>
	queryOptions({
		queryKey: ['i18n'],
		queryFn: () => getI18n$(),
	})

export const useI18n = () => {
	const { data: i18n } = useSuspenseQuery(getI18nQueryOptions())
	return i18n
}

export const useLocale = () => {
	const client = useQueryClient()
	const { locale } = useI18n()
	const changeLocaleMutation = useMutation({
		mutationFn: useServerFn(updateLocale$),
		onSuccess: () => {
			void client.invalidateQueries(getI18nQueryOptions())
		},
	})
	return {
		locale,
		changeLocaleMutation,
	}
}

export const getTimeZoneQueryOptions = () =>
	queryOptions({
		queryKey: ['timeZone'],
		queryFn: () => getTimeZone$(),
	})

export const useTimeZone = () => {
	const client = useQueryClient()
	const { data: timeZone } = useSuspenseQuery(getTimeZoneQueryOptions())
	const changeTimeZoneMutation = useMutation({
		mutationFn: useServerFn(setTimeZoneInSession$),
		onSuccess: () => {
			void client.invalidateQueries(getTimeZoneQueryOptions())
		},
	})
	return {
		timeZone,
		changeTimeZoneMutation,
	}
}

export type SupportedLocale = (typeof supportedLocales)[number]['locale']
export type Translator = Awaited<ReturnType<typeof getTranslations>>
export type TranslatorKeys = Parameters<Translator>[0]
export const tk = <TKey extends TranslatorKeys>(key: TKey): TKey => {
	return key
}
