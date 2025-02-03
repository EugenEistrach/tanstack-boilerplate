'use client'

import { useOverlayPosition } from '@react-aria/overlays'
import { useCombobox } from 'downshift'
import { Check, Trash, X } from 'lucide-react'
import * as React from 'react'
import {
	useController,
	type Control,
	type FieldValues,
	type Path,
} from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import * as m from '@/lib/paraglide/messages'
import { cn } from '@/lib/shared/utils'

export interface Tag {
	id: string
	text: string
}

export interface TagInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
	name: TName
	control: Control<TFieldValues>
	suggestions?: Tag[]
	placeholder?: string
	className?: string
	onChange?: (value: Tag[]) => void
	onCreateTag?: (tagText: string) => Promise<Tag>
	onDeleteTag?: (tag: Tag) => Promise<void>
}

export function TagInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
	name,
	control,
	suggestions = [],
	placeholder,
	className,
	onChange,
	onCreateTag,
	onDeleteTag,
}: TagInputProps<TFieldValues, TName>) {
	const {
		field: { value: fieldValue = [], onChange: fieldOnChange },
	} = useController({
		name,
		control,
	})

	const [inputValue, setInputValue] = React.useState('')
	const [isFocused, setIsFocused] = React.useState(false)
	const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(
		null,
	)
	const [isDeleting, setIsDeleting] = React.useState(false)
	const value = fieldValue as Tag[]
	const inputRef = React.useRef<HTMLInputElement>(null)
	const listRef = React.useRef<HTMLDivElement>(null)
	const overlayRef = React.useRef<HTMLDivElement>(null)
	const wrapperRef = React.useRef<HTMLDivElement>(null)

	const { overlayProps } = useOverlayPosition({
		targetRef: wrapperRef,
		overlayRef,
		placement: 'bottom',
		offset: 4,
		isOpen: isFocused,
	})

	const items = React.useMemo(() => {
		if (!inputValue) return suggestions
		const filtered = suggestions.filter((suggestion) =>
			suggestion.text.toLowerCase().includes(inputValue.toLowerCase()),
		)
		if (
			inputValue.trim() &&
			!filtered.some((item) => item.text === inputValue.trim()) &&
			onCreateTag
		) {
			filtered.push({ id: 'create', text: `Create "${inputValue.trim()}"` })
		}
		return filtered
	}, [inputValue, suggestions, onCreateTag])

	const resetConfirmation = React.useCallback(() => {
		setDeleteConfirmId(null)
		setIsDeleting(false)
	}, [])

	const handleSelect = async (selectedText: string | null) => {
		if (!selectedText) return false

		const createPrefix = 'Create "'
		const isCreate = selectedText.startsWith(createPrefix)
		const actualText = isCreate
			? selectedText.slice(createPrefix.length, -1)
			: selectedText

		if (!actualText.trim()) return false

		const existingTag = value.find((tag) => tag.text === actualText)
		if (existingTag) {
			return false
		}

		const matchingSuggestion = suggestions.find((s) => s.text === actualText)
		if (matchingSuggestion) {
			const newTags = [...value, matchingSuggestion]
			fieldOnChange(newTags)
			onChange?.(newTags)
			return true
		} else if (onCreateTag) {
			const newTag = await onCreateTag(actualText)
			const newTags = [...value, newTag]
			fieldOnChange(newTags)
			onChange?.(newTags)
			return true
		}
		return false
	}

	const handleRemove = (tagToRemove: Tag, fromButton?: boolean) => {
		const tagIndex = value.findIndex((tag) => tag.id === tagToRemove.id)
		const newTags = value.filter((tag) => tag.id !== tagToRemove.id)
		fieldOnChange(newTags)
		onChange?.(newTags)

		if (fromButton) {
			// Find the next element to focus
			const wrapper = wrapperRef.current
			if (wrapper) {
				const buttons = Array.from(
					wrapper.querySelectorAll<HTMLButtonElement>('button[type="button"]'),
				)

				if (newTags.length === 0) {
					// If no tags left, focus the input
					inputRef.current?.focus()
				} else if (tagIndex === buttons.length - 1) {
					// If we removed the last tag, focus the new last tag
					buttons[buttons.length - 2]?.focus()
				} else {
					// Focus the next tag
					buttons[tagIndex]?.focus()
				}
			}
		}
	}

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !inputValue && value.length > 0) {
			const lastTag = value[value.length - 1]
			if (lastTag) {
				handleRemove(lastTag)
			}
		} else if (e.key === 'Escape') {
			e.preventDefault()
			e.stopPropagation()
			inputRef.current?.blur()
			setIsFocused(false)
		}
	}

	const handleDelete = React.useCallback(
		async (tag: Tag) => {
			if (onDeleteTag) {
				setIsDeleting(true)
				try {
					await onDeleteTag(tag)
				} finally {
					resetConfirmation()
				}
			}
		},
		[onDeleteTag, resetConfirmation],
	)

	const { getMenuProps, getInputProps, getItemProps, highlightedIndex } =
		useCombobox({
			items,
			inputValue,
			isOpen: isFocused,
			defaultHighlightedIndex: -1,
			selectedItem: null,
			onInputValueChange: ({ inputValue, type }) => {
				if (type === useCombobox.stateChangeTypes.InputChange) {
					setInputValue((inputValue || '').trim())
				}
			},
			onSelectedItemChange: async ({ selectedItem, type }) => {
				if (!selectedItem || type === useCombobox.stateChangeTypes.InputBlur)
					return
				const wasAdded = await handleSelect(selectedItem.text)
				if (wasAdded) {
					setInputValue('')
				}
			},
			itemToString: (item) => item?.text || '',
			stateReducer: (state, actionAndChanges) => {
				const { changes, type } = actionAndChanges

				switch (type) {
					case useCombobox.stateChangeTypes.InputChange:
						return {
							...changes,
							highlightedIndex: changes.inputValue ? 0 : -1,
						}
					case useCombobox.stateChangeTypes.InputKeyDownEnter:
						if (state.highlightedIndex === -1) {
							if (inputValue) {
								void handleSelect(inputValue)
									.then((wasAdded) => {
										if (wasAdded) {
											setInputValue('')
										}
									})
									.catch(() => {
										// Handle error silently - tag creation failed
									})
							}
						}
						return {
							...changes,
							highlightedIndex: state.highlightedIndex,
						}
					case useCombobox.stateChangeTypes.InputKeyDownEscape:
						inputRef.current?.blur()
						return changes
					case useCombobox.stateChangeTypes.InputBlur:
						return {
							...changes,
							isOpen: false,
							highlightedIndex: -1,
						}
					default:
						return changes
				}
			},
		})

	return (
		<div
			ref={wrapperRef}
			className={cn(
				'group relative flex flex-col rounded-md border border-input bg-background shadow-sm transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
				className,
			)}
		>
			{value.length > 0 && (
				<div className="flex flex-wrap gap-1.5 px-2 pt-2">
					{value.map((tag) => (
						<Badge
							key={tag.id}
							variant="secondary"
							className="inline-flex items-center gap-1"
						>
							{tag.text}
							<button
								type="button"
								className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
								onClick={() => handleRemove(tag, true)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleRemove(tag, true)
									}
								}}
							>
								<X className="h-3 w-3" />
								<span className="sr-only">
									{m.fuzzy_witty_orangutan_splash({ tag: tag.text })}
								</span>
							</button>
						</Badge>
					))}
				</div>
			)}
			<div className="flex min-h-[36px] w-full items-center px-2 py-1">
				<input
					{...getInputProps({
						ref: inputRef,
						onKeyDown: (e) => {
							if (e.key === 'Tab' && e.shiftKey) {
								const buttons = Array.from(
									wrapperRef.current?.querySelectorAll<HTMLButtonElement>(
										'button[type="button"]',
									) || [],
								)
								if (buttons.length > 0) {
									e.preventDefault()
									buttons[buttons.length - 1]?.focus()
								}
							} else {
								void handleKeyDown(e)
							}
						},
						onFocus: () => setIsFocused(true),
						onBlur: () => setIsFocused(false),
						placeholder: value.length === 0 ? placeholder : undefined,
						className:
							'w-full border-0 bg-transparent p-0 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
					})}
				/>
			</div>
			{isFocused && (
				<div
					{...getMenuProps({
						ref: listRef,
					})}
					style={{
						...overlayProps.style,
						width: wrapperRef.current?.offsetWidth,
					}}
					ref={overlayRef}
					className="z-50 rounded-md border bg-popover p-1 shadow-md"
				>
					<div className="max-h-[300px] overflow-auto">
						<div className="overflow-hidden py-1 text-foreground">
							{items.map((item, index) => {
								const isSelected = value.some((tag) => tag.id === item.id)
								const isCreateOption = item.id === 'create'
								return (
									<div
										key={item.id}
										{...getItemProps({
											index,
											item,
											className: cn(
												'group flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm',
												index === highlightedIndex &&
													'bg-accent text-accent-foreground',
												!isSelected &&
													index !== highlightedIndex &&
													'hover:bg-accent/50 hover:text-accent-foreground',
											),
										})}
									>
										<span>{item.text}</span>
										<div className="flex items-center gap-2">
											{isSelected && (
												<Check className="h-4 w-4 text-foreground" />
											)}
											{!isCreateOption && onDeleteTag && (
												<TooltipProvider>
													<Tooltip
														open={
															deleteConfirmId === item.id ? true : undefined
														}
													>
														<TooltipTrigger asChild>
															<button
																onClick={(e) => {
																	e.preventDefault()
																	e.stopPropagation()
																	if (deleteConfirmId === item.id) {
																		void handleDelete(item)
																	} else {
																		setDeleteConfirmId(item.id)
																	}
																}}
																onMouseLeave={() => {
																	if (!isDeleting) {
																		setTimeout(resetConfirmation, 100)
																	}
																}}
																onBlur={() => {
																	if (!isDeleting) {
																		setTimeout(resetConfirmation, 100)
																	}
																}}
																className={cn(
																	'opacity-0 transition-all focus:opacity-100 group-hover:opacity-100',
																	deleteConfirmId === item.id
																		? 'text-destructive hover:text-destructive/90'
																		: 'text-muted-foreground hover:text-foreground',
																)}
															>
																<Trash className="h-4 w-4" />
																<span className="sr-only">
																	{deleteConfirmId === item.id
																		? m.vexed_east_gorilla_stir({ tag: item.text })
																		: m.wild_major_jannes_surge({ tag: item.text })}
																</span>
															</button>
														</TooltipTrigger>
														<TooltipContent side="right" sideOffset={5}>
															{deleteConfirmId === item.id
																? m.vexed_east_gorilla_stir({ tag: item.text })
																: m.wild_major_jannes_surge({ tag: item.text })}
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											)}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
