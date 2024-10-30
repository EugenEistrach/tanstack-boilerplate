import { Link, type LinkProps } from '@tanstack/react-router'

import { forwardRef } from 'react'

export const NavLink = forwardRef<HTMLAnchorElement, LinkProps>(
	(props, ref) => {
		return (
			<Link
				{...props}
				ref={ref as any}
				activeProps={{
					'data-active': true,
					...props.activeProps,
				}}
			/>
		)
	},
)
NavLink.displayName = 'NavLink'
