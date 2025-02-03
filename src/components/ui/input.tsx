import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

import { useState } from 'react'
import * as m from '@/lib/paraglide/messages'
import { cn } from '@/lib/shared/utils'

export interface InputProps extends React.ComponentPropsWithRef<'input'> {}

const Input = ({ className, type, ...props }: InputProps) => {
	return (
		<input
			type={type}
			className={cn(
				'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			ref={props.ref}
			{...props}
		/>
	)
}

Input.displayName = 'Input'

export default function PasswordInput({
	className,
	...props
}: Omit<InputProps, 'type'>) {
	const [isVisible, setIsVisible] = useState<boolean>(false)

	const toggleVisibility = () => setIsVisible((prevState) => !prevState)

	return (
		<div className="relative">
			<Input
				className={cn(className, 'pe-9')}
				type={isVisible ? 'text' : 'password'}
				{...props}
			/>
			<button
				className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
				type="button"
				onClick={toggleVisibility}
				aria-label={isVisible ? m.same_long_vulture_pride() : m.caring_lower_husky_bend()}
				aria-pressed={isVisible}
				aria-controls="password"
			>
				{isVisible ? (
					<EyeOff size={16} strokeWidth={2} aria-hidden="true" />
				) : (
					<Eye size={16} strokeWidth={2} aria-hidden="true" />
				)}
			</button>
		</div>
	)
}

export { Input }
