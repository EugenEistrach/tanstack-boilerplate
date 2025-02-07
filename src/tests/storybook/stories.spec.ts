import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { test, expect } from '@playwright/test'

interface StorybookStory {
	id: string
	title: string
	name: string
	type: 'story' | 'docs'
	parameters?: {
		noScreenshot?: boolean
		// Add parameters for controlling animations
		disableAnimations?: boolean
		waitForLoadingState?: boolean
	}
}

interface StorybookIndex {
	v: number
	entries: Record<string, StorybookStory>
}

// Build Storybook if needed before any tests run
test.beforeAll(async () => {
	const indexPath = path.join(process.cwd(), 'storybook-static', 'index.json')

	const needsBuild = (() => {
		try {
			// If index.json doesn't exist, we need to build
			if (!fs.existsSync(indexPath)) {
				console.log('Storybook build not found, building...')
				return true
			}

			// Get the timestamp of the last build
			const buildTime = fs.statSync(indexPath).mtimeMs

			// Check if any story files are newer than the build
			const command =
				process.platform === 'win32'
					? `dir /s /b src\\**\\*.stories.tsx`
					: `find src -name "*.stories.tsx"`

			const storyFiles = execSync(command, { encoding: 'utf-8' })
				.split('\n')
				.filter(Boolean)

			// Check if any story file is newer than the build
			const hasNewerFiles = storyFiles.some((file) => {
				const fileTime = fs.statSync(file).mtimeMs
				return fileTime > buildTime
			})

			if (hasNewerFiles) {
				console.log('Story files have changed, rebuilding...')
				return true
			}

			console.log('Using existing Storybook build')
			return false
		} catch (error) {
			console.log('Error checking build status, rebuilding to be safe:', error)
			return true
		}
	})()

	if (needsBuild) {
		execSync('pnpm build-storybook', { stdio: 'inherit' })
	}
})

// Read the Storybook index and generate tests
const indexPath = path.join(process.cwd(), 'storybook-static', 'index.json')
const indexContent = fs.readFileSync(indexPath, 'utf-8')
const { entries } = JSON.parse(indexContent) as StorybookIndex

// Filter to only get actual stories (no docs pages)
const stories = Object.values(entries).filter((story) => story.type === 'story')

// Create a test for each story
for (const story of stories) {
	const { id, title, name, parameters } = story

	// Skip stories that set noScreenshot = true
	if (parameters?.noScreenshot) continue

	test(`${title} - ${name}`, async ({ page }) => {
		const storybookUrl = 'http://localhost:6006'

		// Disable CSS animations if requested by the story
		if (parameters?.disableAnimations) {
			await page.addStyleTag({
				content: `
					*, *::before, *::after {
						animation-duration: 0s !important;
						animation-delay: 0s !important;
						transition-duration: 0s !important;
						transition-delay: 0s !important;
					}
				`,
			})
		}

		// Navigate directly to the story iframe
		await page.goto(`${storybookUrl}/iframe.html?id=${id}&viewMode=story`)

		// Wait for the story to be fully rendered
		await page.waitForFunction(() => {
			return !document
				.getElementById('storybook-preview-iframe')
				?.classList.contains('sb-loading')
		})

		// For components with loading states, ensure they're stable
		if (parameters?.waitForLoadingState) {
			// Wait for any loading spinners to complete at least one rotation
			await page.waitForTimeout(1000)
		}

		// Capture screenshot for visual regression
		await expect(page).toHaveScreenshot(`${title}-${name}.png`, {
			threshold: 0.2,
			animations: 'disabled', // Playwright's built-in animation handling
			// Increase timeout for stories with loading states
			timeout: parameters?.waitForLoadingState ? 10000 : 5000,
		})
	})
}
