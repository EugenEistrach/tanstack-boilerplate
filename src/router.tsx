import { QueryClient } from '@tanstack/react-query'
import {
	createRouter as createTanStackRouter,
	type ErrorComponentProps,
	Link,
} from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'

import { NotFound } from './components/not-found'
import { routeTree } from './routeTree.gen'
import * as m from '@/lib/paraglide/messages'

export const ErrorPage = ({ error }: ErrorComponentProps) => (
	<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
		<h1 className="mb-4 text-6xl font-bold text-destructive">500</h1>
		<p className="mb-4 text-xl text-muted-foreground">
			{m.candid_fluffy_alpaca_quell()}
		</p>
		<div className="mb-4 w-full max-w-2xl overflow-auto rounded-lg bg-muted p-4">
			<h2 className="mb-2 text-lg font-semibold">{m.frail_fuzzy_porpoise_wish()}</h2>
			<p className="mb-2 text-sm">
				<strong>{m.every_caring_sparrow_dust()}</strong> {error.message}
			</p>
		</div>

		<div className="flex gap-4">
			<Link
				to="/"
				className="rounded-lg bg-secondary px-6 py-3 text-secondary-foreground transition-colors hover:bg-secondary/90"
			>
				{m.frail_wild_monkey_trip()}
			</Link>
			<button
				type="button"
				onClick={() => window.location.reload()}
				className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
			>
				{m.grand_east_orangutan_enrich()}
			</button>
		</div>
	</div>
)

export function createRouter() {
	const queryClient = new QueryClient()

	return routerWithQueryClient(
		createTanStackRouter({
			scrollRestoration: true,
			routeTree,
			context: { queryClient },
			//defaultPreload: 'intent',
			defaultNotFoundComponent: NotFound,
			defaultErrorComponent: ErrorPage,
		}),
		queryClient,
	)
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}
