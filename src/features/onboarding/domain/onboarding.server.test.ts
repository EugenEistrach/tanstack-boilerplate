import { eq } from 'drizzle-orm'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { completeOnboarding, getOnboardingInfo } from './onboarding.server'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/_exports'
import { env } from '@/lib/server/env.server'
import { createUser } from '@/tests/test-utils'

describe('onboarding.server', () => {
	describe('getOnboardingInfo', () => {
		it('should return null for user without onboarding info', () => {
			const user = createUser()
			const result = getOnboardingInfo(user.id)
			expect(result).toBeNull()
		})

		it('should return onboarding info for completed user', () => {
			const user = createUser()
			completeOnboarding({
				userId: user.id,
				favoriteColor: 'blue',
				name: 'Updated Name',
			})

			const result = getOnboardingInfo(user.id)
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

		it('should complete onboarding for regular user', () => {
			const user = createUser()

			completeOnboarding({
				userId: user.id,
				favoriteColor: 'red',
				name: 'New Name',
			})

			const updatedUser = db
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

		it('should set admin role for admin email', () => {
			const user = createUser({ email: 'admin@example.com' })

			completeOnboarding({
				userId: user.id,
				favoriteColor: 'green',
				name: 'Admin User',
			})

			const updatedUser = db
				.select()
				.from(UserTable)
				.where(eq(UserTable.id, user.id))
				.get()

			expect(updatedUser?.role).toBe('admin')
		})

		it('should throw error for non-existent user', () => {
			expect(() =>
				completeOnboarding({
					userId: 'non-existent-id',
					favoriteColor: 'blue',
					name: 'Test Name',
				}),
			).toThrow('User not found')
		})
	})
})
