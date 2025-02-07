import { type LucideProps, Loader2 } from 'lucide-react'
import * as React from 'react'

import { Button, type ButtonProps } from './button'

export interface LoadingButtonProps extends ButtonProps {
	loading: boolean
	Icon: React.ComponentType<LucideProps & React.HTMLAttributes<SVGElement>>
	iconPosition?: 'left' | 'right'
}

export const LoadingButton = React.forwardRef<
	HTMLButtonElement,
	LoadingButtonProps
>(
	(
		{ children, disabled, loading, Icon, iconPosition = 'left', ...props },
		ref,
	) => {
		return (
			<Button ref={ref} {...props} disabled={disabled || loading}>
				{!loading && iconPosition === 'left' && (
					<Icon className="mr-2 h-4 w-4" />
				)}
				{loading && iconPosition === 'left' && (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				)}
				{children}
				{!loading && iconPosition === 'right' && (
					<Icon className="ml-2 h-4 w-4" />
				)}
				{loading && iconPosition === 'right' && (
					<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				)}
			</Button>
		)
	},
)
LoadingButton.displayName = 'LoadingButton'
