import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'
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

	await expect(
		page.getByRole('heading', { name: 'Approval Required' }),
	).toBeVisible()

	await db.update(UserTable).set({
		hasAccess: true,
	})

	await page.reload()
	await page.waitForLoadState('networkidle')

	await page.getByPlaceholder('Enter your favorite color').fill('red')

	await delayed(() =>
		page.getByRole('button', { name: 'Complete Onboarding' }).click(),
	)

	await expect(
		page.getByRole('heading', { name: 'Transactions' }),
	).toBeVisible()

	await page.goto(`/login`)
	expect(page.url()).toContain(`/dashboard`)

	await page.goto(`/onboarding`)
	expect(page.url()).toContain(`/dashboard`)
})
