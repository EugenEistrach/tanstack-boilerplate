import { zodResolver } from '@hookform/resolvers/zod'
import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { eq } from 'drizzle-orm'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'use-intl'
import { z } from 'zod'
import { requireAuthSession } from '@/app/auth/auth-session'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { FieldErrorMessage } from '@/app/components/ui/field-error-message'
import { Input } from '@/app/components/ui/input'
import { db } from '@/app/db'
import { note } from '@/app/db/schema'

import { validationClient } from '@/app/lib/functions'
import { tk } from '@/app/lib/i18n'

const validateContentAsync = createServerFn('POST', async (content: string) => {
	return content !== 'error'
})

const getNotes = createServerFn('GET', async () => {
	const { user } = await requireAuthSession()
	const canReadAny = user.permissions.includes('notes:read:any')
	return db.query.note.findMany({
		where: canReadAny ? undefined : eq(note.ownerId, user.id),
	})
})

const noteSchema = z.object({
	content: z
		.string()
		.min(1, { message: tk('notes.validation.required') })
		.refine(validateContentAsync, {
			message: tk('notes.validation.refine'),
		}),
})

const createNote = createServerFn(
	'POST',
	validationClient
		.input(noteSchema)
		.handler(async ({ parsedInput: { content } }) => {
			const { user } = await requireAuthSession()
			return db
				.insert(note)
				.values({ content, ownerId: user.id })
				.returning()
				.get()
		}),
)

const notesQueryOptions = () =>
	queryOptions({
		queryKey: ['notes'],
		queryFn: () => getNotes(),
	})

export const Route = createFileRoute('/dashboard/_authenticated/notes')({
	component: Home,
	beforeLoad: () => {
		return {
			breadcrumb: 'Notes',
		}
	},
	loader: async ({ context }) =>
		await context.queryClient.ensureQueryData(notesQueryOptions()),
})

function Home() {
	const queryClient = useQueryClient()
	const { data: notes } = useSuspenseQuery(notesQueryOptions())
	const t = useTranslations()

	const {
		register,
		handleSubmit,

		formState: { errors, isValidating },
		reset,
	} = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues: {
			content: '',
		},
	})

	const createNoteMutation = useMutation({
		mutationFn: useServerFn(createNote),
		onSuccess: () => {
			void queryClient.invalidateQueries(notesQueryOptions())
			reset()
		},
	})

	const onSubmit = (data: z.infer<typeof noteSchema>) => {
		createNoteMutation.mutate(data)
	}

	return (
		<div className="max-w-2xl">
			<form onSubmit={handleSubmit(onSubmit)} className="mb-6">
				<div className="flex gap-2">
					<Input
						{...register('content')}
						placeholder={t('notes.placeholder')}
						className="flex-grow"
					/>
					<Button
						type="submit"
						disabled={isValidating || createNoteMutation.isPending}
					>
						{t('notes.submit')}
					</Button>
				</div>
				<FieldErrorMessage error={errors.content} />
			</form>

			<div className="space-y-4">
				{notes.map((note) => (
					<Card key={note.id}>
						<CardContent className="p-4">
							<p>{note.content}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
