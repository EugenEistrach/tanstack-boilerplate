import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/privacy')({
	component: () => <div>Hello /(landing-page)/privacy!</div>,
})
