import { cn } from '@/lib/shared/utils'

export function H1({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h1 className={cn('text-3xl font-bold', className)} {...props}>
			{children}
		</h1>
	)
}

export function H2({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h2 className={cn('text-2xl font-bold', className)} {...props}>
			{children}
		</h2>
	)
}

export function Subtitle({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<div className={cn('text-muted-foreground', className)} {...props}>
			{children}
		</div>
	)
}
