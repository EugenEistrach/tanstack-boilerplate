import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/terms')({
	// eslint-disable-next-line i18next/no-literal-string
	component: () => <div>Hello /(landing-page)/terms!</div>,
})
