import { expect, test } from '@/tests/playwright'
import { delayed } from '@/tests/test-utils'

test('login with github ', async ({ page, baseURL }) => {
	await page.route('https://github.com/**', async (route) => {
		const url = route.request().url()
		if (url.includes('/login/oauth/authorize')) {
			const originalUrl = new URL(url)
			const state = originalUrl.searchParams.get('state')

			await route.fulfill({
				status: 302,
				headers: {
					Location: `${baseURL}api/auth/callback/github?code=mock-code&state=${state}`,
				},
			})
		} else {
			await route.continue()
		}
	})

	await page.goto(`/dashboard/settings`)
	await page.waitForURL('**\/login*')

	await page.getByRole('button', { name: 'Sign in with GitHub' }).click()
	await page.waitForLoadState('networkidle')

	await page.getByPlaceholder('Enter your name').fill('Test ABC')

	await page.getByPlaceholder('Enter your favorite color').fill('red')

	await delayed(() =>
		page.getByRole('button', { name: 'Complete Onboarding' }).click(),
	)

	await expect(page.getByLabel("What's your name?")).toHaveValue('Test ABC')
	await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

	await page.goto(`/login`)
	expect(page.url()).toContain(`/dashboard`)

	await page.goto(`/onboarding`)
	expect(page.url()).toContain(`/dashboard`)
})
