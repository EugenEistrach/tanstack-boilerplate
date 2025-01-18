import { faker } from '@faker-js/faker'
import { http, HttpResponse } from 'msw'
import { generateGitHubUser } from './github.fixtures'

export const githubHandlers = [
	http.post('https://github.com/login/oauth/access_token', () => {
		return HttpResponse.json({
			access_token: 'mock-access-token',
			token_type: 'bearer',
			scope: 'read:user,user:email',
		})
	}),

	http.get('https://api.github.com/user', () => {
		return HttpResponse.json(generateGitHubUser())
	}),

	http.get('https://api.github.com/user/emails', () => {
		return HttpResponse.json([
			{
				email: faker.internet.email(),
				primary: true,
				verified: true,
				visibility: 'public',
			},
			{
				email: faker.internet.email(),
				primary: false,
				verified: true,
				visibility: null,
			},
		])
	}),
]
