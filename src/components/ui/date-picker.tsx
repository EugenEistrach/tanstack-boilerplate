'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import * as m from '@/lib/paraglide/messages'
import { cn } from '@/lib/shared/utils'

interface DatePickerProps {
	date?: Date
	onSelect?: (date: Date | undefined) => void
	className?: string
}

export function DatePicker({ date, onSelect, className }: DatePickerProps) {
	const [open, setOpen] = React.useState(false)

	const handleSelect = (selectedDate: Date | undefined) => {
		onSelect?.(selectedDate)
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					tabIndex={0}
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, 'PPP') : m.pick_date()}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start" modal>
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleSelect}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
