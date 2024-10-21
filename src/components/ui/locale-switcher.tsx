'use client'

import { CheckIcon, ChevronDownIcon, GlobeIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useLocale } from 'use-intl'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supportedLocales, useChangeLocaleMutation } from '@/lib/i18n'

export function LocaleSwitcher() {
	const locale = useLocale()
	const changeLocaleMutation = useChangeLocaleMutation()

	const [open, setOpen] = useState(false)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="min-w-[8rem]">
					<GlobeIcon className="mr-2 h-4 w-4" />
					{supportedLocales.find((l) => l.locale === locale)?.label}
					<ChevronDownIcon className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{supportedLocales.map(({ locale: supportedLocale, label }) => (
					<DropdownMenuItem
						key={supportedLocale}
						onClick={(event) => {
							event.preventDefault()
							changeLocaleMutation.mutate(supportedLocale, {
								onSettled: () => {
									// Close the dropdown after short delay to prevent
									// flickering when clicking on the trigger`
									setTimeout(() => {
										setOpen(false)
									}, 100)
								},
							})
						}}
					>
						{label}
						{supportedLocale === locale && (
							<CheckIcon className="ml-2 h-4 w-4" />
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
