'use client'

import { ExitIcon, GearIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { useTranslations } from 'use-intl'
import { Skeleton } from './skeleton'
import { useAuth } from '@/app/auth/auth-hooks'
import { destroyAuthSession } from '@/app/auth/auth-session'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'

export const UserMenu = () => {
	const { user } = useAuth()
	const t = useTranslations()

	const name = user.name || user.email.split('@')[0] || ''
	const email = user.email
	const image = user.avatarUrl ?? ''

	const shortName = name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()

	const handleSignOut = useServerFn(destroyAuthSession)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src={image} alt={t('user.avatarAlt')} />
						<AvatarFallback>{shortName}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72 p-0" align="end">
				<div className="flex items-center border-b p-4">
					<Avatar className="mr-4 h-12 w-12">
						<AvatarImage src={image} alt={t('user.avatarAlt')} />
						<AvatarFallback>{shortName}</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-base font-medium">{name}</p>
						<p className="text-sm text-muted-foreground">{email}</p>
					</div>
				</div>
				<DropdownMenuItem
					className="p-3 hover:bg-accent focus:bg-accent"
					asChild
				>
					<Link to="/dashboard/settings">
						<GearIcon className="mr-3 h-5 w-5" />
						<span className="text-sm">{t('user.settings')}</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleSignOut()}
					className="p-3 hover:bg-accent focus:bg-accent"
				>
					<ExitIcon className="mr-3 h-5 w-5" />
					<span className="text-sm">{t('user.signOut')}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
