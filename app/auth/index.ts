import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { eq } from 'drizzle-orm'
import { Lucia } from 'lucia'
import { db } from '../db'
import { type Permission } from './auth-permissions'
import { sessionTable, userTable } from './auth-tables'

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env['NODE_ENV'] === 'production',
		},
	},
	getUserAttributes: (attributes) => {
		const user = db.query.userTable
			.findFirst({
				with: {
					usersToRoles: {
						with: {
							role: {
								with: {
									rolesToPermissions: {
										with: {
											permission: true,
										},
									},
								},
							},
						},
					},
				},
				where: eq(userTable.email, attributes.email),
			})
			.sync()

		if (!user) {
			throw new Error('User not found')
		}

		const roles = user.usersToRoles.map((userToRole) => userToRole.role.name)
		const permissions = new Set(
			user.usersToRoles.flatMap((userToRole) =>
				userToRole.role.rolesToPermissions.map(
					(roleToPermission) =>
						`${roleToPermission.permission.resource}:${roleToPermission.permission.action}:${roleToPermission.permission.access}` satisfies Permission,
				),
			),
		)

		return {
			email: attributes.email,
			avatarUrl: attributes.avatarUrl,
			name: attributes.name,
			roles: roles,
			permissions: [...permissions],
		}
	},
})

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	email: string
	avatarUrl?: string
	name?: string
}
