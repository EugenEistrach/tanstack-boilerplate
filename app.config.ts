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
		typescript: {
			tsConfig: {
				compilerOptions: {
					// top level await etc
					target: 'ES2022',
				},
			},
		},
		esbuild: {
			options: {
				target: 'ES2022',
			},
		},
	},
	tsr: {
		appDirectory: 'app',
		routeFilePrefix: '~',
	},
})
