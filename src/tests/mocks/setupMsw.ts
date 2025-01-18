import closeWithGrace from 'close-with-grace'
import { setupServer } from 'msw/node'

import { githubHandlers } from './github/github.mocks'

export const server = setupServer(...githubHandlers)

server.listen({
	onUnhandledRequest: 'error',
})

if (process.env['NODE_ENV'] !== 'test') {
	console.info('🔶 Mock server installed')

	closeWithGrace(() => {
		server.close()
	})
}
