'use client'

import { Check, ChevronDown, Globe } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChangeLocaleMutation } from '@/lib/client/i18n.client'
import { availableLanguageTags, languageTag } from '@/lib/paraglide/runtime'

const labels = {
	de: 'Deutsch',
	en: 'English',
}

export function LocaleSwitcher() {
	const locale = languageTag()
	const changeLocaleMutation = useChangeLocaleMutation()

	const [open, setOpen] = useState(false)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="min-w-[8rem]">
					<Globe className="mr-2 h-4 w-4" />
					{labels[locale]}
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{availableLanguageTags.map((availableTag) => (
					<DropdownMenuItem
						key={availableTag}
						onClick={(event) => {
							event.preventDefault()
							changeLocaleMutation.mutate(
								{ data: { locale: availableTag } },
								{
									onSettled: () => {
										// Close the dropdown after short delay to prevent
										// flickering when clicking on the trigger`
										setTimeout(() => {
											setOpen(false)
										}, 100)
									},
								},
							)
						}}
					>
						{labels[availableTag]}
						{availableTag === locale && <Check className="ml-2 h-4 w-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
