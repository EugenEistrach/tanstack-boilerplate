import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
	component: () => (
		<div>
			{/* eslint-disable-next-line i18next/no-literal-string */}
			<div>Hello /dashboard/_authenticated/!</div>
		</div>
	),
})
