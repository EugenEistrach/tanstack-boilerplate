import { expect, test } from 'vitest'
import { env } from '@/lib/server/env.server'
import { mockEnvOverrides } from '@/tests/mocks/vitest.mocks'

test('basic env validation', () => {
	expect(env.APP_NAME).toBe('Tanstack Boilerplate')
})

test('mock works', () => {
	mockEnvOverrides({
		APP_NAME: 'Mocked App Name',
	})

	expect(env.APP_NAME).toBe('Mocked App Name')
})
