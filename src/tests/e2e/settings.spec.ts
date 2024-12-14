import { expect, test } from '@/tests/playwright'

test('can change settings', async ({ page, login }) => {
	await login()

	await page.goto('/dashboard')
	await page.waitForLoadState('networkidle')

	await page.getByTestId('user-menu-trigger').click()
	await page.getByRole('menuitem', { name: 'Settings' }).click()

	await page.getByLabel("What's your name?").fill('test name')
	await page.getByRole('button', { name: 'Save Changes' }).click()

	await expect(page.getByText('Profile updated successfully')).toBeVisible()
	await expect(page.getByLabel("What's your name?")).toHaveValue('test name')
	await expect(page.getByTestId('user-menu-trigger')).toContainText('test name')
})

test('can change theme', async ({ page, login }) => {
	await login()
	await expect(page.locator('body')).toHaveClass(/dark/)

	await page.getByRole('button', { name: 'Toggle theme' }).click()
	await page.getByRole('menuitem', { name: 'Light' }).click()

	await expect(page.locator('body')).not.toHaveClass(/dark/)
	await expect(page.locator('body')).toHaveClass(/light/)

	await page.getByRole('button', { name: 'Toggle theme' }).click()
	await page.getByRole('menuitem', { name: 'Dark' }).click()

	await expect(page.locator('body')).toHaveClass(/dark/)
	await expect(page.locator('body')).not.toHaveClass(/light/)

	await page.getByRole('button', { name: 'Toggle theme' }).click()
	await page.getByRole('menuitem', { name: 'System' }).click()

	await expect(page.locator('body')).toHaveClass(/dark/)
	await expect(page.locator('body')).not.toHaveClass(/light/)
})

test.describe('client hints', () => {
	test.use({
		colorScheme: 'light',
		timezoneId: 'Europe/Paris',
	})

	test('preferences are reflected in cookies', async ({ page, login }) => {
		await login()
		await page.waitForLoadState('networkidle')

		const colorSchemeCookie = await page.evaluate(() => {
			return document.cookie
				.split('; ')
				.find((cookie) => cookie.startsWith('CH-prefers-color-scheme='))
				?.split('=')[1]
		})
		expect(colorSchemeCookie).toBe('light')

		const timeZoneCookie = await page.evaluate(() => {
			return document.cookie
				.split('; ')
				.find((cookie) => cookie.startsWith('CH-time-zone='))
				?.split('=')[1]
		})
		expect(timeZoneCookie).toBe('Europe%2FParis')
	})
})
