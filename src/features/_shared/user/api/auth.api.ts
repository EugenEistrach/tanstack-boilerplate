import { useMutation } from '@tanstack/react-query'
import { redirect, useMatch, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getWebRequest } from '@tanstack/start/server'
import { type } from 'arktype'
import { createAuthClient } from 'better-auth/client'
import { adminClient, organizationClient } from 'better-auth/client/plugins'
import {
	authServer,
	isEmailAvailable,
} from '@/features/_shared/user/domain/auth.server'

import { getOnboardingInfo } from '@/features/_shared/user/domain/onboarding.server'
import { env } from '@/lib/server/env.server'

export const authClient = createAuthClient({
	plugins: [adminClient(), organizationClient()],
})

export const useAuth = () => {
	const auth = useOptionalAuth()

	if (!auth) {
		throw new Error(
			'No auth found but is required. Use useOptionalAuth() to check if auth is available.',
		)
	}

	return auth
}

export const useOptionalAuth = () => {
	const { loaderData } = useMatch({ from: '__root__', strict: true })
	return loaderData?.auth
}

export const useEmailSignIn = () => {
	const navigate = useNavigate()
	return useMutation({
		mutationFn: async (values: { email: string; password: string }) => {
			const result = await authClient.signIn.email(values)

			if (result.error) {
				if (result.error.status === 403) {
					return ['verification_required'] as const
				}
				throw new Error(result.error.message, { cause: result.error })
			}

			return [null] as const
		},
		onSuccess: ([expectedError]) => {
			if (!expectedError) {
				void navigate({ to: '/dashboard' })
			}
		},
	})
}

export const useSocialSignIn = () => {
	return useMutation({
		mutationFn: async (options: {
			provider: 'github'
			callbackURL: string
		}) => {
			const result = await authClient.signIn.social(options)

			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}

			return [null] as const
		},
	})
}

export const EmailNotAvailableError = 'email_not_available' as const

export const useEmailSignUp = () => {
	const navigate = useNavigate()
	return useMutation({
		mutationFn: async (values: {
			name: string
			email: string
			password: string
		}) => {
			const isAvailable = await $isEmailAvailable({
				data: { email: values.email },
			})

			if (!isAvailable) {
				return [EmailNotAvailableError] as const
			}

			const result = await authClient.signUp.email(values)

			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}

			if (!result.data.user.emailVerified) {
				await navigate({
					to: '/verify-email',
					search: { email: values.email },
				})
				return ['verification_required'] as const
			}

			return [null] as const
		},
		onSuccess: ([expectedError]) => {
			if (!expectedError) {
				void navigate({ to: '/onboarding' })
			}
		},
	})
}

export const usePasswordReset = () => {
	return useMutation({
		mutationFn: async (values: { token: string; password: string }) => {
			const result = await authClient.resetPassword({
				token: values.token,
				newPassword: values.password,
			})
			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}
			return [null] as const
		},
	})
}

export const usePasswordResetRequest = () => {
	return useMutation({
		mutationFn: async (values: { email: string }) => {
			const result = await authClient.forgetPassword(values)
			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}
			return [null] as const
		},
	})
}

export const useEmailVerification = () => {
	return useMutation({
		mutationFn: async (values: { email: string }) => {
			const result = await authClient.sendVerificationEmail({
				email: values.email,
				callbackURL: '/verification-success',
			})

			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}
			return [null] as const
		},
	})
}

export const $getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		try {
			const request = getWebRequest()

			if (!request) {
				throw new Error('Request not found')
			}

			const session = await authServer.api.getSession({
				headers: request.headers,
			})

			if (!session || !session.user) {
				return null
			}

			const hasAccess = env.ENABLE_ADMIN_APPROVAL
				? session.user.role === 'admin' || session.user.hasAccess
				: true

			const onboardingInfo = await getOnboardingInfo(session.user.id)

			return {
				...session,
				user: {
					...session.user,
					hasAccess,
					onboardingInfo,
				},
			}
		} catch (error) {
			console.error(error)
			return null
		}
	},
)

export const $isEmailAvailable = createServerFn({ method: 'GET' })
	.validator(
		type({
			'email?': 'string',
		}),
	)
	.handler(async ({ data }) => {
		return data.email && isEmailAvailable(data.email)
	})

export const $logout = createServerFn({ method: 'POST' }).handler(async () => {
	const request = getWebRequest()

	if (!request) {
		throw new Error('Request not found')
	}

	await authServer.api.signOut({ headers: request.headers })
	throw redirect({ to: '/login' })
})
