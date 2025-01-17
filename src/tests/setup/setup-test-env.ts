import 'dotenv/config'
import './db-setup'
import { vi, afterEach, beforeEach, type MockInstance } from 'vitest'
// import { cleanup } from '@testing-library/react'
import { server } from '@/tests/mocks'

const mockDb = vi.hoisted(async () => {
	const mod = await import('./test-db.js')
	return { db: mod.testDb }
})

// Mock the database import to use testDb
vi.mock('@/drizzle/db', () => mockDb)

afterEach(() => server.resetHandlers())
// afterEach(() => cleanup())

export let consoleError: MockInstance<(typeof console)['error']>

beforeEach(() => {
	const originalConsoleError = console.error
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(
		(...args: Parameters<typeof console.error>) => {
			originalConsoleError(...args)
			throw new Error(
				'Console error was called. Call consoleError.mockImplementation(() => {}) if this is expected.',
			)
		},
	)
})
