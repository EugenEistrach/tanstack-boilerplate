import { defineConfig } from '@tanstack/start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	vite: {
		plugins: [
			viteTsConfigPaths({
				projects: ['./tsconfig.json'],
			}),
		],
	},
	server: {
		preset: 'node-server',
		esbuild: {
			options: {
				target: 'ES2022',
			},
		},
	},
	routers: {
		ssr: {
			entry: './src/entry.server.tsx',
		},
		client: {
			entry: './src/entry.client.tsx',
		},
		api: {
			entry: './src/entry.api.ts',
		},
	},
	tsr: {
		appDirectory: './src/',
		routesDirectory: './src/routes/',
		generatedRouteTree: './src/routeTree.gen.ts',
	},
})
