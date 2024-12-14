import { describe, expect, test, vi } from 'vitest'
import { isSupportedLanguage, normalizeLanguage } from './i18n'
import { availableLanguageTags } from '@/lib/paraglide/runtime'

// Mock the paraglide runtime module
vi.mock('@/lib/paraglide/runtime', () => ({
	availableLanguageTags: ['en', 'es', 'fr'] as const,
}))

describe('isSupportedLanguage', () => {
	test('returns true for available language tags', () => {
		availableLanguageTags.forEach((lang) => {
			expect(isSupportedLanguage(lang)).toBe(true)
		})
	})

	test('returns true for language tags with region codes', () => {
		expect(isSupportedLanguage('en-US')).toBe(true)
		expect(isSupportedLanguage('en-GB')).toBe(true)
		expect(isSupportedLanguage('es-MX')).toBe(true)
		expect(isSupportedLanguage('fr-FR')).toBe(true)
	})

	test('returns false for unsupported languages', () => {
		expect(isSupportedLanguage('xyz')).toBe(false)
		expect(isSupportedLanguage('abc-XY')).toBe(false)
		expect(isSupportedLanguage('de')).toBe(false)
		expect(isSupportedLanguage('it-IT')).toBe(false)
	})

	test('returns false for invalid inputs', () => {
		expect(isSupportedLanguage(null)).toBe(false)
		expect(isSupportedLanguage(undefined)).toBe(false)
		expect(isSupportedLanguage('')).toBe(false)
	})
})

describe('normalizeLanguage', () => {
	test('returns exact match for available language tags', () => {
		availableLanguageTags.forEach((lang) => {
			expect(normalizeLanguage(lang)).toBe(lang)
		})
	})

	test('normalizes language tags with region codes', () => {
		expect(normalizeLanguage('en-US')).toBe('en')
		expect(normalizeLanguage('es-MX')).toBe('es')
		expect(normalizeLanguage('fr-FR')).toBe('fr')
	})

	test('returns first available language for unsupported languages', () => {
		expect(normalizeLanguage('xyz')).toBe('en') // first language is 'en'
		expect(normalizeLanguage('abc-XY')).toBe('en')
		expect(normalizeLanguage('de')).toBe('en')
		expect(normalizeLanguage('it-IT')).toBe('en')
	})

	test('returns first available language for invalid inputs', () => {
		expect(normalizeLanguage(null)).toBe('en')
		expect(normalizeLanguage(undefined)).toBe('en')
		expect(normalizeLanguage('')).toBe('en')
	})

	test('handles case-insensitive matching', () => {
		expect(normalizeLanguage('EN')).toBe('en')
		expect(normalizeLanguage('En-US')).toBe('en')
		expect(normalizeLanguage('ES-mx')).toBe('es')
		expect(normalizeLanguage('FR-ca')).toBe('fr')
	})
})
