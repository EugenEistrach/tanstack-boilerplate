import {
	queryOptions,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import {
	redirect,
	useMatch,
	useNavigate,
	useRouter,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getWebRequest } from '@tanstack/start/server'
import { type } from 'arktype'
import { createAuthClient } from 'better-auth/client'
import { adminClient, organizationClient } from 'better-auth/client/plugins'

import {
	authServer,
	getSession,
	isEmailAvailable,
	setUserPassword,
} from '@/features/_shared/user/domain/auth.server'

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

export const activeSessionsQueryOptions = () =>
	queryOptions({
		queryKey: ['activeSessions'],
		queryFn: async () => {
			const result = await authClient.listSessions()

			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}

			return result.data
		},
	})

export const useEmailSignInMutation = () => {
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

export const useSocialSignInMutation = () => {
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

export const useEmailSignUpMutation = () => {
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

export const usePasswordResetRequestMutation = () => {
	return useMutation({
		mutationFn: async (values: { email: string }) => {
			const result = await authClient.forgetPassword({
				email: values.email,
				redirectTo: '/reset-password',
			})
			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}
			return [null] as const
		},
	})
}

export const usePasswordResetMutation = () => {
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

export const usePasswordSetRequestMutation = () => {
	const router = useRouter()
	return useMutation({
		mutationFn: async (values: { newPassword: string }) => {
			return $setUserPassword({
				data: {
					newPassword: values.newPassword,
				},
			})
		},
		onSuccess: () => {
			void router.invalidate()
		},
	})
}

export const usePasswordUpdateMutation = () => {
	const router = useRouter()
	return useMutation({
		mutationFn: async (values: {
			currentPassword: string
			newPassword: string
		}) => {
			const result = await authClient.changePassword(values)
			if (result.error) {
				throw new Error(result.error.message, { cause: result.error })
			}
			return [null] as const
		},
		onSuccess: () => {
			void router.invalidate()
		},
	})
}

export const useEmailVerificationMutation = () => {
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

export const useSessionRevokeMutation = () => {
	const queryClient = useQueryClient()
	const router = useRouter()
	return useMutation({
		mutationFn: async (values: { token: string }) => {
			return authClient.revokeSession({ token: values.token })
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['activeSessions'] })
			void router.invalidate()
		},
	})
}

export const $getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		return getSession()
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

const $setUserPassword = createServerFn({ method: 'POST' })
	.validator(
		type({
			newPassword: 'string >= 8',
		}),
	)
	.handler(async ({ data }) => {
		return setUserPassword(data)
	})
