import { faker } from '@faker-js/faker'

export const generateGitHubUser = (
	options: {
		login?: string
		id?: number
		name?: string
		email?: string
		avatarUrl?: string
		emailVerified?: boolean
	} = {},
) => ({
	id: options.id ?? faker.number.int(),
	login: options.login ?? faker.internet.username(),
	name: options.name ?? faker.person.fullName(),
	email: options.email ?? faker.internet.email(),
	avatar_url: options.avatarUrl ?? faker.image.avatarGitHub(),
	email_verified: options.emailVerified ?? true,
})
