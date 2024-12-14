import { describe, expect, it } from 'vitest'
import { slugify, makeUnique, formatMilliseconds } from './utils'

describe('slugify', () => {
	it('should convert string to lowercase', () => {
		expect(slugify('Hello World')).toBe('hello-world')
	})

	it('should replace spaces with hyphens', () => {
		expect(slugify('this is a test')).toBe('this-is-a-test')
	})

	it('should remove special characters', () => {
		expect(slugify('Hello! @World#')).toBe('hello-world')
	})

	it('should handle multiple spaces and special characters', () => {
		expect(slugify('  Hello!!!  World  ')).toBe('hello-world')
	})

	it('should remove leading and trailing hyphens', () => {
		expect(slugify('---hello world---')).toBe('hello-world')
	})
})

describe('makeUnique', () => {
	it('should return original slug if not in existing array', () => {
		const result = makeUnique('test', ['other', 'values'])
		expect(result).toBe('test')
	})

	it('should append suffix if slug exists', () => {
		const result = makeUnique('test', ['test'])
		expect(result).toMatch(/^test-[a-z0-9]{5}$/)
	})

	it('should handle multiple existing slugs', () => {
		const existing = ['test', 'test-abc12', 'test-def34']
		const result = makeUnique('test', existing)
		expect(result).toMatch(/^test-[a-z0-9]{5}$/)
		expect(existing).not.toContain(result)
	})
})

describe('formatMilliseconds', () => {
	it('should format seconds correctly', () => {
		expect(formatMilliseconds(1000)).toBe('1 second')
		expect(formatMilliseconds(2000)).toBe('2 seconds')
	})

	it('should format minutes correctly', () => {
		expect(formatMilliseconds(60000)).toBe('1 minute')
		expect(formatMilliseconds(120000)).toBe('2 minutes')
	})

	it('should format hours correctly', () => {
		expect(formatMilliseconds(3600000)).toBe('1 hour')
		expect(formatMilliseconds(7200000)).toBe('2 hours')
	})

	it('should format days correctly', () => {
		expect(formatMilliseconds(86400000)).toBe('1 day')
		expect(formatMilliseconds(172800000)).toBe('2 days')
	})

	it('should use the largest appropriate unit', () => {
		// 1 day and 2 hours should just show "1 day"
		expect(formatMilliseconds(86400000 + 7200000)).toBe('1 day')
	})
})
