import { sqliteTable } from 'drizzle-orm/sqlite-core'

export const UserTable = sqliteTable('user', (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	email: t.text().notNull().unique(),
	emailVerified: t.integer({ mode: 'boolean' }).notNull(),
	image: t.text(),
	createdAt: t.integer({ mode: 'timestamp' }).notNull(),
	updatedAt: t.integer({ mode: 'timestamp' }).notNull(),
	role: t.text(),
	banned: t.integer({ mode: 'boolean' }),
	banReason: t.text(),
	banExpires: t.integer(),
}))

export const SessionTable = sqliteTable('session', (t) => ({
	id: t.text().primaryKey(),
	expiresAt: t.integer({ mode: 'timestamp' }).notNull(),
	ipAddress: t.text(),
	userAgent: t.text(),
	userId: t
		.text()
		.notNull()
		.references(() => UserTable.id),
	impersonatedBy: t.text(),
	activeOrganizationId: t.text(),
}))

export const AccountTable = sqliteTable('account', (t) => ({
	id: t.text().primaryKey(),
	accountId: t.text().notNull(),
	providerId: t.text().notNull(),
	userId: t
		.text()
		.notNull()
		.references(() => UserTable.id),
	accessToken: t.text(),
	refreshToken: t.text(),
	idToken: t.text(),
	expiresAt: t.integer({ mode: 'timestamp' }),
	password: t.text(),
}))

export const VerificationTable = sqliteTable('verification', (t) => ({
	id: t.text().primaryKey(),
	identifier: t.text().notNull(),
	value: t.text().notNull(),
	expiresAt: t.integer({ mode: 'timestamp' }).notNull(),
}))

export const OrganizationTable = sqliteTable('organization', (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	slug: t.text().unique(),
	logo: t.text(),
	createdAt: t.integer({ mode: 'timestamp' }).notNull(),
	metadata: t.text(),
}))

export const MemberTable = sqliteTable('member', (t) => ({
	id: t.text().primaryKey(),
	organizationId: t
		.text()
		.notNull()
		.references(() => OrganizationTable.id),
	userId: t.text().notNull(),
	email: t.text().notNull(),
	role: t.text().notNull(),
	createdAt: t.integer({ mode: 'timestamp' }).notNull(),
}))

export const InvitationTable = sqliteTable('invitation', (t) => ({
	id: t.text().primaryKey(),
	organizationId: t
		.text()
		.notNull()
		.references(() => OrganizationTable.id),
	email: t.text().notNull(),
	role: t.text(),
	status: t.text().notNull(),
	expiresAt: t.integer({ mode: 'timestamp' }).notNull(),
	inviterId: t
		.text()
		.notNull()
		.references(() => UserTable.id),
}))
