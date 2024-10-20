'use client'

import { Link, useMatches } from '@tanstack/react-router'

import React from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb'

export function Breadcrumbs() {
	const matches = useMatches()

	const breadcrumbs = matches
		.map((match) => {
			const breadcrumb = match.__beforeLoadContext['breadcrumb']
			if (!breadcrumb || typeof breadcrumb !== 'string') return null
			return {
				label: breadcrumb,
				href: match.pathname,
			}
		})
		.filter((breadcrumb) => !!breadcrumb)

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((item, index) => (
					<React.Fragment key={item.href}>
						<BreadcrumbItem>
							{index < breadcrumbs.length - 1 ? (
								<BreadcrumbLink asChild>
									<Link to={item.href}>{item.label}</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
