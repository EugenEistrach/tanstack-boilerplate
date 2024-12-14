import { Link } from '@tanstack/react-router'
import * as m from '@/lib/paraglide/messages'

export const NotFound = () => (
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
