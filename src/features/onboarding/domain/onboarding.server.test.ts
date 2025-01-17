import { eq } from 'drizzle-orm'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { completeOnboarding, getOnboardingInfo } from './onboarding.server'

import { UserTable } from '@/drizzle/schemas/_exports'
import { env } from '@/lib/server/env.server'
import { testDb } from '@/tests/setup/test-db'
import { createUser } from '@/tests/test-utils'

describe('onboarding.server', () => {
	describe('getOnboardingInfo', () => {
		it('should return null for user without onboarding info', async () => {
			const user = await createUser()
			const result = await getOnboardingInfo(user.id)
			expect(result).toBeNull()
		})

		it('should return onboarding info for completed user', async () => {
			const user = await createUser()
			await completeOnboarding({
				userId: user.id,
				favoriteColor: 'blue',
				name: 'Updated Name',
			})

			const result = await getOnboardingInfo(user.id)
			expect(result).toMatchObject({
				userId: user.id,
				favoriteColor: 'blue',
			})
		})
	})

	describe('completeOnboarding', () => {
		const originalAdminEmails = env.ADMIN_USER_EMAILS

		beforeEach(() => {
			env.ADMIN_USER_EMAILS = ['admin@example.com']
		})

		afterEach(() => {
			env.ADMIN_USER_EMAILS = originalAdminEmails
		})

		it('should complete onboarding for regular user', async () => {
			const user = await createUser()

			await completeOnboarding({
				userId: user.id,
				favoriteColor: 'red',
				name: 'New Name',
			})

			const updatedUser = await testDb
				.select()
				.from(UserTable)
				.where(eq(UserTable.id, user.id))
				.get()

			expect(updatedUser).toMatchObject({
				name: 'New Name',
				role: 'user',
			})

			const onboardingInfo = getOnboardingInfo(user.id)
			expect(onboardingInfo).toMatchObject({
				userId: user.id,
				favoriteColor: 'red',
			})
		})

		it('should set admin role for admin email', async () => {
			const user = await createUser({ email: 'admin@example.com' })

			await completeOnboarding({
				userId: user.id,
				favoriteColor: 'green',
				name: 'Admin User',
			})

			const updatedUser = await testDb
				.select()
				.from(UserTable)
				.where(eq(UserTable.id, user.id))
				.get()

			expect(updatedUser?.role).toBe('admin')
		})

		it('should throw error for non-existent user', async () => {
			await expect(
				completeOnboarding({
					userId: 'non-existent-id',
					favoriteColor: 'blue',
					name: 'Test Name',
				}),
			).rejects.toThrow('User not found')
		})
	})
})
