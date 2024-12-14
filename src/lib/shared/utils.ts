import { createId } from '@paralleldrive/cuid2'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function cuid() {
	return createId()
}

export function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export function makeUnique(slug: string, existing: string[]) {
	if (!existing.includes(slug)) {
		return slug
	}

	const suffixLength = 5
	let attempts = 0
	const maxAttempts = 10

	while (attempts < maxAttempts) {
		const suffix = cuid().slice(0, suffixLength)
		const newSlug = `${slug}-${suffix}`
		if (!existing.includes(newSlug)) {
			return newSlug
		}
		attempts++
	}

	// If we couldn't find a unique slug after maxAttempts, use a full cuid
	return `${slug}-${cuid()}`
}

export const formatMilliseconds = (ms: number): string => {
	const seconds = Math.floor(ms / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
	if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
	if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`
	return `${seconds} second${seconds > 1 ? 's' : ''}`
}
