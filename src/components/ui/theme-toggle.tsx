'use client'

import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import { Button } from './button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './dropdown-menu'
import * as m from '@/lib/paraglide/messages'

import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={cn(className)}>
					<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">{m.toggle_theme()}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>
					{m.theme_light()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					{m.theme_dark()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					{m.theme_system()}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
