import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const getTest$ = createServerFn('GET', () => {
	return 'test abc'
})

const getTestQueryOptions = () =>
	queryOptions({
		queryKey: ['test'],
		queryFn: () => getTest$(),
	})

export const Route = createFileRoute('/test')({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getTestQueryOptions())
	},
	component: Test,
})

function Test() {
	const { data } = useSuspenseQuery(getTestQueryOptions())

	return <div>{data} asdf</div>
}
