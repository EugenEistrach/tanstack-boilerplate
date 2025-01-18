import { vi } from 'vitest'

import { requireAuthSession } from '@/lib/server/auth.server'
import { env } from '@/lib/server/env.server'
import { createUserAndSession } from '@/tests/test-utils'

type User = Awaited<ReturnType<typeof createUserAndSession>>[0]
type Session = Awaited<ReturnType<typeof createUserAndSession>>[1]

export function mockEnvOverrides(overrides: Partial<typeof env>) {
	const mockedEnv = vi.mocked(env)
	Object.assign(mockedEnv, overrides)
}

export function mockAuthSession(user: User, session: Session) {
	vi.mocked(requireAuthSession).mockResolvedValue({
		session: {
			...session,
			ipAddress: session.ipAddress ?? undefined,
			userAgent: session.userAgent ?? undefined,
			impersonatedBy: session.impersonatedBy ?? undefined,
			activeOrganizationId: session.activeOrganizationId ?? undefined,
		},
		user: {
			...user,
			image: user.image ?? undefined,
			banned: user.banned ?? undefined,
			banReason: user.banReason ?? undefined,
			banExpires: undefined,
			role: user.role ?? undefined,
		},
	})
}

export async function setupAuthSession() {
	const [user, session] = await createUserAndSession()

	mockAuthSession(user, session)
	return { user, session }
}
