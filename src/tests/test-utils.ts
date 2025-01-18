import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { UniqueEnforcer } from 'enforce-unique'

import { SessionTable, UserTable } from '@/drizzle/schemas/auth-schema'
import { OnboardingInfoTable } from '@/drizzle/schemas/onboarding-schema'
import { cuid, wait } from '@/lib/shared/utils'
import { testDb } from '@/tests/setup/test-db'
const uniqueUsernameEnforcer = new UniqueEnforcer()

export type UserOptions = {
	id?: string
	email?: string
	name?: string
	role?: 'admin' | 'user'
}

export function createFakeUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const username = uniqueUsernameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.username({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')
	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

export function createUser(options: UserOptions = {}) {
	return testDb.transaction((tx) => {
		const fakeUser = createFakeUser()
		const user = tx
			.insert(UserTable)
			.values({
				id: cuid(),
				email: options.email ?? fakeUser.email,
				name: options.name ?? fakeUser.name,
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				role: options.role ?? 'user',
			})
			.returning()
			.get()

		return user
	})
}

export async function createUserAndSession(options: UserOptions = {}) {
	return testDb.transaction(async (tx) => {
		if (options.id) {
			const user = tx
				.select()
				.from(UserTable)
				.where(eq(UserTable.id, options.id))
				.get()

			if (!user) throw new Error('User not found. You must use a valid id.')

			const id = cuid()
			const session = tx
				.insert(SessionTable)
				.values({
					id,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
					userId: user.id,
					token: id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning()
				.get()

			tx.insert(OnboardingInfoTable)
				.values({ id: cuid(), userId: user.id })
				.returning({ id: OnboardingInfoTable.id })
				.get()
			return [user, session] as const
		} else {
			const fakeUser = createFakeUser()
			const user = tx
				.insert(UserTable)
				.values({
					id: cuid(),
					email: options.email ?? fakeUser.email,
					name: options.name ?? fakeUser.name,
					emailVerified: true,
					createdAt: new Date(),
					updatedAt: new Date(),
					role: options.role ?? 'user',
				})
				.returning()
				.get()

			const id = cuid()
			const session = tx
				.insert(SessionTable)
				.values({
					id,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
					userId: user.id,
					token: id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning()
				.get()
			tx.insert(OnboardingInfoTable)
				.values({ id: cuid(), userId: user.id })
				.returning({ id: OnboardingInfoTable.id })
				.get()
			return [user, session] as const
		}
	})
}

export const delayed = async <T>(callback: () => Promise<T>): Promise<T> => {
	await wait(250)
	return callback()
}
