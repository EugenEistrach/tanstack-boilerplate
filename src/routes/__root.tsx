import { type QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
	createRootRouteWithContext,
	Outlet,
	ScrollRestoration,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'

import filePondCss from 'filepond/dist/filepond.min.css?url'
import * as React from 'react'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { $getSession, $getVinxiSession } from '@/lib/client/auth.client'
import { $getHints, ClientHintChecker } from '@/lib/client/client-hints.client'

import { useLocale } from '@/lib/client/i18n.client'
import { $handleRedirectTo } from '@/lib/client/redirect.client'

import { TimezoneContext } from '@/lib/client/timezone.client'
import appCss from '@/styles/globals.css?url'

const TanStackRouterDevtools =
	process.env['NODE_ENV'] === 'production'
		? () => null // Render nothing in production
		: React.lazy(() =>
				// Lazy load in development
				import('@tanstack/router-devtools').then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			)

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	beforeLoad: async () => {
		await $handleRedirectTo()
		const [auth, hints, vinxiSession] = await Promise.all([
			$getSession(),
			$getHints(),
			$getVinxiSession(),
		])

		if (!auth) {
			return {
				auth: null,
				hints,
				theme: vinxiSession?.theme ?? hints.colorScheme,
			}
		}

		return {
			auth,
			hints,
			theme: vinxiSession?.theme ?? hints.colorScheme,
		}
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Tanstack Boilerplate',
			},
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'stylesheet', href: filePondCss },
			// {
			// 	rel: 'preload',
			// 	href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap',
			// 	as: 'style',
			// },
			// {
			// 	rel: 'stylesheet',
			// 	href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap',
			// },
		],
	}),
	component: RootComponent,
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const { hints, theme } = Route.useRouteContext()
	const lang = useLocale()
	return (
		<html lang={lang}>
			<head>
				<Meta />
			</head>
			<body className={theme}>
				<ClientHintChecker />
				<TimezoneContext.Provider value={hints.timeZone}>
					<TooltipProvider>
						<div className="font-sans">{children}</div>

						<Toaster />
					</TooltipProvider>
				</TimezoneContext.Provider>
				<ScrollRestoration />
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools buttonPosition="bottom-right" />
				<Scripts />
			</body>
		</html>
	)
}
