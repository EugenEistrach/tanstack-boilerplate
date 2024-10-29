import { type QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
	createRootRouteWithContext,
	Outlet,
	ScrollRestoration,
} from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import { ThemeProvider } from 'next-themes'
import * as React from 'react'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { $getSession, AuthProvider } from '@/lib/auth.client'
import { $getHints, ClientHintChecker } from '@/lib/client-hints'

import { $handleRedirectTo } from '@/lib/redirect'

import { TimezoneContext } from '@/lib/timezone'
import appCss from '@/styles/globals.css?url'

// TODO: remove once https://github.com/TanStack/router/pull/2316 is merged and released
if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', () => {
		window.location.reload()
	})
}

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
		const [session, hints] = await Promise.all([$getSession(), $getHints()])

		if (!session) {
			return {
				auth: null,
				hints,
			}
		}

		return {
			auth: {
				user: {
					...session.user,
					createdAt: new Date(session.user.createdAt as unknown as string),
					updatedAt: new Date(session.user.updatedAt as unknown as string),
				},
				session: {
					...session.session,
					expiresAt: new Date(session.session.expiresAt as unknown as string),
				},
			},
			hints,
		}
	},
	meta: () => [
		{
			charSet: 'utf-8',
		},
		{
			name: 'viewport',
			content: 'width=device-width, initial-scale=1',
		},
		{
			title: 'Tanstack - Boilerplate',
		},
	],
	component: RootComponent,
	links: () => [
		{ rel: 'stylesheet', href: appCss },
		{
			rel: 'preload',
			href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap',
			as: 'style',
		},
		{
			rel: 'stylesheet',
			href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap',
		},
	],
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const { hints, auth } = Route.useRouteContext()

	return (
		// TODO: Add lang attribute once supported by tanstack start
		<Html>
			<Head>
				<Meta />
			</Head>
			<Body>
				<ClientHintChecker />
				<AuthProvider auth={auth}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<TimezoneContext.Provider value={hints.timeZone}>
							<TooltipProvider>
								<div className="font-sans">{children}</div>

								<Toaster />
							</TooltipProvider>
						</TimezoneContext.Provider>
					</ThemeProvider>
				</AuthProvider>
				<ScrollRestoration />
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools buttonPosition="bottom-right" />
				<Scripts />
			</Body>
		</Html>
	)
}
