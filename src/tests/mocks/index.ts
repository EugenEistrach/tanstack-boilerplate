import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import closeWithGrace from 'close-with-grace'
import { bypass } from 'msw'
import { setupServer } from 'msw/node'
import { githubHandlers } from './github/github-handlers'

const UNHANDLED_REQUESTS_DIR = path.join(
	process.cwd(),
	'src',
	'tests',
	'mocks',
	'unhandled-requests',
)

// Ensure directory exists
if (!fs.existsSync(UNHANDLED_REQUESTS_DIR)) {
	fs.mkdirSync(UNHANDLED_REQUESTS_DIR, { recursive: true })
}

// Create a human readable filename from request details
const getRequestFileName = (req: Request) => {
	const url = new URL(req.url)
	// Convert path to readable format, replace slashes with dashes
	const pathPart = url.pathname
		.replace(/^\/|\/$/g, '') // trim slashes
		.replace(/\//g, '-') // replace remaining slashes with dashes
		.replace(/[^a-zA-Z0-9-]/g, '_') // replace special chars with underscore

	// Add query params hash if they exist
	const queryHash = url.search
		? `-${crypto.createHash('md5').update(url.search).digest('hex').slice(0, 6)}`
		: ''

	// Limit filename length while keeping readability
	const truncatedPath =
		pathPart.length > 50 ? `${pathPart.slice(0, 50)}-truncated` : pathPart

	return `${req.method.toLowerCase()}-${truncatedPath}${queryHash}`
}

export const server = setupServer(...githubHandlers)

server.listen({
	onUnhandledRequest: async (req, print) => {
		const fileName = getRequestFileName(req)
		const jsonPath = path.join(UNHANDLED_REQUESTS_DIR, `${fileName}.json`)
		const txtPath = path.join(UNHANDLED_REQUESTS_DIR, `${fileName}.txt`)

		// Skip if we already have this request saved
		if (fs.existsSync(jsonPath) || fs.existsSync(txtPath)) {
			print.warning()
			return
		}

		const reqClone = req.clone()

		try {
			const response = await fetch(bypass(reqClone))

			// Only save successful responses
			if (!response.ok) {
				print.warning()
				return
			}

			const contentType = response.headers.get('content-type') || ''
			const body = await response.text()

			// Save response based on content type
			if (contentType.includes('application/json')) {
				fs.writeFileSync(jsonPath, JSON.stringify(JSON.parse(body), null, 2))
			} else {
				fs.writeFileSync(txtPath, body)
			}

			print.warning()
			console.warn('🔍 Saved unhandled request:', {
				method: req.method,
				url: req.url,
				file: fs.existsSync(jsonPath) ? jsonPath : txtPath,
			})
		} catch (error) {
			print.warning()
			console.warn('❌ Failed to save response:', error)
		}
	},
})

if (process.env['NODE_ENV'] !== 'test') {
	console.info('🔶 Mock server installed')

	closeWithGrace(() => {
		server.close()
	})
}
