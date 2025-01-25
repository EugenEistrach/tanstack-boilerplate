import { type FilePondErrorDescription, type FilePondFile } from 'filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import { useCallback, useRef } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import { type FileTable } from '@/drizzle/schemas/files-schema'

registerPlugin(FilePondPluginFileValidateSize)
registerPlugin(FilePondPluginFileValidateType)

export type FileMetadata = Omit<typeof FileTable.$inferSelect, 'content'>

interface FileUploadProps {
	name: string
	maxFileSize?: string
	onChange?: (fileId: string | null) => void
	onUploadStart?: () => void
	onUploadFinish?: (
		result:
			| [error: FilePondErrorDescription, fileId: null]
			| [null, fileId: string],
	) => void
	onUploadingChange?: (isUploading: boolean) => void
	className?: string
	allowMultiple?: boolean
	text?: string
	acceptedFileTypes?: string[]
	existingFile?: FileMetadata | null
}

export function FileUpload({
	name,
	text,
	onChange,
	onUploadStart,
	onUploadFinish,
	onUploadingChange,
	className,
	existingFile,
	maxFileSize = '2MB',
	acceptedFileTypes = undefined,
	allowMultiple = false,
}: FileUploadProps) {
	const filePondRef = useRef<FilePond>(null)
	const processingFiles = useRef(new Set<string>())

	const updateUploadingState = useCallback(() => {
		const isUploading = processingFiles.current.size > 0
		onUploadingChange?.(isUploading)
	}, [onUploadingChange])

	const handleProcessFile = useCallback(
		(error: FilePondErrorDescription | null, file: FilePondFile) => {
			processingFiles.current.delete(file.id)
			updateUploadingState()

			if (!error && file.serverId) {
				onChange?.(file.serverId)
				onUploadFinish?.([null, file.serverId])
			} else if (error) {
				onUploadFinish?.([error, null])
			}
		},
		[onChange, onUploadFinish, updateUploadingState],
	)

	const handleRemoveFile = useCallback(
		(error: FilePondErrorDescription | null, file: FilePondFile) => {
			processingFiles.current.delete(file.id)
			updateUploadingState()
			onChange?.(null)
		},
		[onChange, updateUploadingState],
	)

	return (
		<div className={className}>
			<FilePond
				ref={filePondRef}
				name={name}
				allowMultiple={allowMultiple}
				maxFileSize={maxFileSize}
				server="/api/upload"
				credits={false}
				className="w-full"
				acceptedFileTypes={acceptedFileTypes}
				onaddfilestart={(file) => {
					processingFiles.current.add(file.id)
					updateUploadingState()
				}}
				onprocessfilestart={() => {
					onUploadStart?.()
				}}
				onprocessfile={handleProcessFile}
				oninit={async () => {
					if (existingFile) {
						await filePondRef.current?.addFile(existingFile.id, {
							type: 'local' as const,
							file: {
								name: existingFile?.name,
								size: existingFile?.size,
								type: existingFile?.contentType,
							},
						})
					}
				}}
				onremovefile={handleRemoveFile}
				labelIdle={text}
			/>
		</div>
	)
}
