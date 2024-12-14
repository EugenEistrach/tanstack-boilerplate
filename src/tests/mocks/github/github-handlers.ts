import { faker } from '@faker-js/faker'
import { http, HttpResponse } from 'msw'

export const GITHUB_API_URL = 'https://api.github.com'
export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth'
export const GITHUB_ACCESS_TOKEN = 'mock-github-access-token'

function createFakeGithubUser() {
	return {
		id: faker.number.int(),
		login: faker.internet.username(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		avatar_url: faker.image.avatarGitHub(),
		email_verified: true,
	}
}

export const githubHandlers = [
	// Handle OAuth access token exchange
	http.post(`${GITHUB_OAUTH_URL}/access_token`, () => {
		console.log('GITHUB_ACCESS_TOKEN', GITHUB_ACCESS_TOKEN)
		return HttpResponse.json({
			access_token: GITHUB_ACCESS_TOKEN,
			token_type: 'bearer',
			scope: 'read:user,user:email',
		})
	}),

	// Handle GitHub user data fetch
	http.get(`${GITHUB_API_URL}/user`, ({ request }) => {
		console.log('GITHUB_API_URL', GITHUB_API_URL)
		const authHeader = request.headers.get('Authorization')
		if (authHeader !== `Bearer ${GITHUB_ACCESS_TOKEN}`) {
			return new HttpResponse(null, { status: 401 })
		}
		return HttpResponse.json(createFakeGithubUser())
	}),
]
