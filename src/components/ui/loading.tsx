import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import React from 'react'
import { cn } from '@/lib/shared/utils'

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
	loading: boolean
	children: React.ReactNode
}

export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
	({ loading, children, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('relative inline-flex w-auto min-w-fit', className)}
				{...props}
			>
				<div className="invisible">{children}</div>
				<div className="absolute inset-0">
					<AnimatePresence initial={false} mode="wait">
						{loading ? (
							<motion.div
								key="spinner"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								transition={{ duration: 0.25, type: 'spring' }}
								className="flex h-full w-full items-center justify-center"
							>
								<Loader2 className="h-4 w-4 animate-spin" />
							</motion.div>
						) : (
							<motion.div
								key="content"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.25, type: 'spring' }}
								className="h-full w-full"
							>
								{children}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		)
	},
)

Loading.displayName = 'Loading'
