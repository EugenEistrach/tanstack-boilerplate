import { valibotResolver } from '@hookform/resolvers/valibot'
import { createServerFn } from '@tanstack/start'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as v from 'valibot'
import { FileUpload } from './file-upload'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import * as m from '@/lib/paraglide/messages'

interface UploadFormValues {
	file: string | null
}

const $handleFormSubmit = createServerFn({ method: 'POST' })
	.validator(
		v.object({
			file: v.string(),
		}),
	)
	.handler(async ({ data }) => {
		console.log(data)
	})

export function UploadForm() {
	const form = useForm<UploadFormValues>({
		resolver: valibotResolver(v.object({ file: v.string() })),
		defaultValues: {
			file: null,
		},
	})

	const fileId = form.watch('file')

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit((data) => {
					if (!data.file) {
						toast.error('Please select a file')
						return
					}
					void $handleFormSubmit({ data: { file: data.file } })
				})}
			>
				<FileUpload
					name="file"
					onChange={(fileId) => form.setValue('file', fileId)}
					maxFileSize="2MB"
				/>

				<Button type="submit" disabled={!fileId} className="w-full">
					{m.upload()}
				</Button>
			</form>
		</Form>
	)
}
