import { QueryClient } from '@tanstack/react-query'
import {
	createRouter as createTanStackRouter,
	type ErrorComponentProps,
	Link,
} from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { routeTree } from './routeTree.gen'
import * as m from '@/lib/paraglide/messages'

const NotFoundPage = () => (
	<div className="flex min-h-screen flex-col items-center justify-center bg-background">
		<h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
		<p className="mb-8 text-xl text-muted-foreground">
			{m.equal_blue_boar_tickle()}
		</p>
		<Link
			to="/"
			className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
		>
			{m.male_brave_alligator_type()}
		</Link>
	</div>
)

const ErrorPage = ({ error, info }: ErrorComponentProps) => (
	<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
		<h1 className="mb-4 text-6xl font-bold text-destructive">500</h1>
		<p className="mb-4 text-xl text-muted-foreground">
			{m.cute_arable_felix_gleam()}
		</p>
		<div className="mb-4 w-full max-w-2xl overflow-auto rounded-lg bg-muted p-4">
			<h2 className="mb-2 text-lg font-semibold">{m.pink_odd_crab_gleam()}</h2>
			<p className="mb-2 text-sm">
				<strong>{m.extra_caring_zebra_advise()}</strong> {error.message}
			</p>
			{error.stack && (
				<div className="mb-2">
					{/* eslint-disable-next-line i18next/no-literal-string */}
					<strong className="text-sm">Stack:</strong>
					<pre className="whitespace-pre-wrap text-xs">{error.stack}</pre>
				</div>
			)}
			{info?.componentStack && (
				<div>
					{/* eslint-disable-next-line i18next/no-literal-string */}
					<strong className="text-sm">Component Stack:</strong>
					<pre className="whitespace-pre-wrap text-xs">
						{info.componentStack}
					</pre>
				</div>
			)}
		</div>

		<div className="flex gap-4">
			<Link
				to="/"
				className="rounded-lg bg-secondary px-6 py-3 text-secondary-foreground transition-colors hover:bg-secondary/90"
			>
				{m.male_brave_alligator_type()}
			</Link>
			<button
				type="button"
				onClick={() => window.location.reload()}
				className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
			>
				{m.keen_mellow_jaguar_aspire()}
			</button>
		</div>
	</div>
)

export function createRouter() {
	const queryClient = new QueryClient()

	return routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			context: { queryClient },
			defaultPreload: 'intent',
			defaultNotFoundComponent: NotFoundPage,
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
