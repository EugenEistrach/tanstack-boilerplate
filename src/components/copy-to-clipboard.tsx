import { Copy, Check } from 'lucide-react'
import React, { useState, useCallback } from 'react'
import { cn } from '@/lib/shared/utils'

interface CopyToClipboardProps {
	children: React.ReactNode
	className?: string
	toCopy?: React.ReactNode
	symbol?: `${string}`
}

export function CopyToClipboard({
	children,
	className,
	toCopy = children,
	symbol,
}: CopyToClipboardProps) {
	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = useCallback(() => {
		const text = React.Children.toArray(toCopy).join('')
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setIsCopied(true)
				setTimeout(() => setIsCopied(false), 1000)
			})
			.catch((err) => {
				console.error('Failed to copy: ', err)
			})
	}, [toCopy])

	return (
		<button
			type="button"
			className={cn(
				'group inline-flex cursor-pointer items-center gap-2',
				className,
			)}
			onClick={handleCopy}
			aria-label="Copy to clipboard"
		>
			<span>{children}</span>
			<span className="inline-flex h-4 w-4 items-center justify-center transition-opacity">
				{isCopied ? (
					<Check className="h-4 w-4 text-green-500" />
				) : (
					<>
						<span className="group-hover:hidden">{symbol}</span>
						<Copy className="hidden h-4 w-4 text-muted-foreground group-hover:block" />
					</>
				)}
			</span>
		</button>
	)
}
