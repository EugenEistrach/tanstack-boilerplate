'use client'

import { subscribeToSchemeChange } from '@epic-web/client-hints/color-scheme'

import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { type } from 'arktype'
import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import * as m from '@/lib/paraglide/messages'
import { themeCookie } from '@/lib/server/session.server'
import { cn } from '@/lib/shared/utils'

const $setTheme = createServerFn({ method: 'POST' })
	.validator(type({ theme: "'light' | 'dark' | 'system'" }))
	.handler(async ({ data: { theme } }) => {
		themeCookie.set(theme)
	})

export function ThemeToggle({ className }: { className?: string }) {
	const router = useRouter()

	useEffect(() => subscribeToSchemeChange(() => router.invalidate()), [router])

	const setTheme = async (theme: 'light' | 'dark' | 'system') => {
		await $setTheme({ data: { theme } })
		await router.invalidate()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={cn(className)}>
					<Sun className="h-4 w-4" />
					<Moon className="absolute h-4 w-4" />
					<span className="sr-only">{m.brave_tidy_mouse_create()}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>
					{m.glad_odd_bat_chop()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					{m.spry_crazy_eagle_propel()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					{m.keen_helpful_coyote_urge()}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
