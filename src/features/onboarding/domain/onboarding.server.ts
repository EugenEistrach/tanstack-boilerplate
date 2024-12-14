import { eq } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/_exports'
import { OnboardingInfoTable } from '@/drizzle/schemas/onboarding-schema'
import { env } from '@/lib/server/env.server'

export function getOnboardingInfo(userId: string) {
	return (
		db
			.select()
			.from(OnboardingInfoTable)
			.where(eq(OnboardingInfoTable.userId, userId))
			.get() ?? null
	)
}

export function completeOnboarding({
	userId,
	favoriteColor,
	name,
}: {
	userId: string
	favoriteColor: string
	name: string
}) {
	return db.transaction((tx) => {
		const user = tx
			.select({
				email: UserTable.email,
			})
			.from(UserTable)
			.where(eq(UserTable.id, userId))
			.get()

		if (!user) {
			throw new Error('User not found')
		}

		tx.update(UserTable)
			.set({
				name,
				role: env.ADMIN_USER_EMAILS.includes(user?.email ?? '')
					? 'admin'
					: 'user',
			})
			.where(eq(UserTable.id, userId))
			.run()

		tx.insert(OnboardingInfoTable)
			.values({
				userId,
				favoriteColor,
			})
			.run()
	})
}
