'use client'

import { ExitIcon, GearIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { useTranslations } from 'use-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth, $logout } from '@/lib/auth.client'

export const UserMenu = () => {
	const { user } = useAuth()
	const t = useTranslations()

	const name = user.name || user.email.split('@')[0] || ''
	const email = user.email
	const image = user.image ?? ''

	const shortName = name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()

	const logout = useServerFn($logout)

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
					onClick={() => logout()}
					className="p-3 hover:bg-accent focus:bg-accent"
				>
					<ExitIcon className="mr-3 h-5 w-5" />
					<span className="text-sm">{t('user.signOut')}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
