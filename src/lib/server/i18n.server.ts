import Headers from '@mjackson/headers'
import { availableLanguageTags } from '@/lib/paraglide/runtime'
import { logger } from '@/lib/server/logger.server'
import { isSupportedLanguage, normalizeLanguage } from '@/lib/shared/i18n'

export const detectLanguage = (request: Request) => {
	const headers = new Headers(request.headers)

	logger.debug(
		{
			operation: 'detectLanguage',
			headers: {
				cookie: headers.cookie.toString(),
				acceptLanguage: headers.acceptLanguage.toString(),
			},
		},
		'Starting language detection',
	)

	const cookieLanguage = headers.cookie.get('lang')

	if (cookieLanguage) {
		const isSupported = isSupportedLanguage(cookieLanguage)
		logger.debug(
			{
				operation: 'detectLanguage',
				cookieLanguage,
				isSupported,
			},
			'Checking cookie language',
		)

		if (isSupported) {
			const normalizedLanguage = normalizeLanguage(cookieLanguage)
			logger.debug(
				{
					operation: 'detectLanguage',
					source: 'cookie',
					language: normalizedLanguage,
				},
				'Language detected from cookie',
			)
			return normalizedLanguage
		}
	}

	const acceptLanguage =
		headers.acceptLanguage.languages.find(isSupportedLanguage)

	if (acceptLanguage) {
		const normalizedLanguage = normalizeLanguage(acceptLanguage)
		logger.debug(
			{
				operation: 'detectLanguage',
				source: 'acceptLanguage',
				language: normalizedLanguage,
			},
			'Language detected from Accept-Language header',
		)
		return normalizedLanguage
	}

	logger.debug(
		{
			operation: 'detectLanguage',
			source: 'default',
			language: availableLanguageTags[0],
		},
		'Using default language',
	)

	return availableLanguageTags[0]
}
