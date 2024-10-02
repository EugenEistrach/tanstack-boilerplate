import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/terms')({
  component: () => <div>Hello /(landing-page)/terms!</div>,
})
