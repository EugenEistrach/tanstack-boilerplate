import {
	type AvailableLanguageTag,
	availableLanguageTags,
} from '@/lib/paraglide/runtime'

export const isSupportedLanguage = (
	language: string | null | undefined,
): language is AvailableLanguageTag => {
	if (!language) return false

	if (availableLanguageTags.includes(language as any)) {
		return true
	}

	const [baseLanguage] = language.split('-')
	if (!baseLanguage) return false

	return availableLanguageTags.includes(baseLanguage.toLowerCase() as any)
}

export const normalizeLanguage = (
	language: string | null | undefined,
): AvailableLanguageTag => {
	if (!language) return availableLanguageTags[0]

	if (availableLanguageTags.includes(language as any)) {
		return language as AvailableLanguageTag
	}

	const [baseLanguage] = language.split('-')
	if (!baseLanguage) return availableLanguageTags[0]

	const normalizedBase = baseLanguage.toLowerCase()
	if (availableLanguageTags.includes(normalizedBase as any)) {
		return normalizedBase as AvailableLanguageTag
	}

	return availableLanguageTags[0]
}
