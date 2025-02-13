import { createFileRoute } from '@tanstack/react-router'

import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/dashboard/admin/uploads')({
	loader: () => ({
		crumb: m.lime_light_mare_earn(),
	}),
	component: UploadsPage,
})

function UploadsPage() {
	return (
		<div className="mx-auto max-w-2xl">
			<h2 className="mb-4 text-2xl font-bold">{m.spicy_proud_albatross_loop()}</h2>

		</div>
	)
}
