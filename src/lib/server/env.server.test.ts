import { expect, test } from 'vitest'
import { env } from '@/lib/server/env.server'
import { mockEnvOverrides } from '@/tests/mocks/vitest.mocks'

test('basic env validation', () => {
	expect(env.APPLICATION_URL).toBe('http://localhost:3000')
})

test('mock works', () => {
	mockEnvOverrides({
		APPLICATION_URL: 'http://localhost:3002',
	})

	expect(env.APPLICATION_URL).toBe('http://localhost:3002')
})
