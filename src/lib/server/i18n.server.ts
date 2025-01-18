import Headers from '@mjackson/headers'
import { availableLanguageTags } from '@/lib/paraglide/runtime'
import { logger } from '@/lib/server/logger.server'
import { isSupportedLanguage, normalizeLanguage } from '@/lib/shared/i18n'

export const detectLanguage = (request: Request) => {
	const headers = new Headers(request.headers)

	logger.debug('Starting language detection', {
		operation: 'detectLanguage',
		headers: {
			cookie: headers.cookie.toString(),
			acceptLanguage: headers.acceptLanguage.toString(),
		},
	})

	const cookieLanguage = headers.cookie.get('lang')

	if (cookieLanguage) {
		const isSupported = isSupportedLanguage(cookieLanguage)
		logger.debug('Checking cookie language', {
			operation: 'detectLanguage',
			cookieLanguage,
			isSupported,
		})

		if (isSupported) {
			const normalizedLanguage = normalizeLanguage(cookieLanguage)
			logger.debug('Language detected from cookie', {
				operation: 'detectLanguage',
				source: 'cookie',
				language: normalizedLanguage,
			})
			return normalizedLanguage
		}
	}

	const acceptLanguage =
		headers.acceptLanguage.languages.find(isSupportedLanguage)

	if (acceptLanguage) {
		const normalizedLanguage = normalizeLanguage(acceptLanguage)
		logger.debug('Language detected from Accept-Language header', {
			operation: 'detectLanguage',
			source: 'acceptLanguage',
			language: normalizedLanguage,
		})
		return normalizedLanguage
	}

	logger.debug('Using default language', {
		operation: 'detectLanguage',
		source: 'default',
		language: availableLanguageTags[0],
	})

	return availableLanguageTags[0]
}
