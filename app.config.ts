import { defineConfig } from '@tanstack/start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const viteEnvVariables = Object.fromEntries(
	Object.entries(process.env)
		.filter(([key]) => key.startsWith('VITE_'))
		.map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
)

export default defineConfig({
	vite: {
		plugins: [
			viteTsConfigPaths({
				projects: ['./tsconfig.json'],
			}),
		],
		define: {
			...viteEnvVariables,
		},
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
