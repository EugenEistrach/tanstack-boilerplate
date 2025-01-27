# Routing Guide

## Overview

This project uses TanStack Router for type-safe routing. Routes are organized in
the `src/routes` directory with a file-based routing system.

## Route Types

- **Public Routes** (`src/routes/_marketing/`): Marketing/public pages
- **Auth Routes** (`src/routes/(auth)/`): Authentication-related pages
- **Dashboard Routes** (`src/routes/dashboard/`): Protected pages requiring
  authentication (handled by dashboard layout)
- **Admin Routes** (`src/routes/dashboard/admin/`): Protected pages requiring
  admin role (handled by admin layout)

## Creating New Routes

### Basic Route

Create a new file in the appropriate directory:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path/to/route')({
	component: YourComponent,
})
```

### Dashboard Route

Simply create a file in the dashboard directory - auth is automatically handled
by the layout:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/your-route')({
	// Optional: Add breadcrumb
	loader: () => ({
		crumb: 'Your Route',
	}),
	component: YourComponent,
})
```

### Admin Route

Simply create a file in the admin directory - auth and admin role check is
automatically handled by the layout:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/your-route')({
	loader: () => ({
		crumb: 'Your Admin Route',
	}),
	component: YourComponent,
})
```

## Adding to Navigation

To add a route to the dashboard navigation, edit `src/routes/dashboard.tsx`:

1. Import your icon:

```tsx
import { YourIcon } from 'lucide-react'
```

2. Add to the SidebarContent component:

```tsx
<SidebarMenu>
	<SidebarMenuItem>
		<SidebarMenuButton tooltip="Your Route" asChild>
			<NavLink to="/dashboard/your-route">
				<YourIcon />
				<span>Your Route</span>
			</NavLink>
		</SidebarMenuButton>
	</SidebarMenuItem>
</SidebarMenu>
```

## Route Features

### Breadcrumbs

Add a `crumb` in the loader to show in breadcrumb navigation:

```tsx
loader: () => ({
	crumb: 'Your Route',
})
```

### Page Title

Add meta information in the route:

```tsx
head: () => ({
	meta: [
		{
			title: 'Your Route - Dashboard',
		},
	],
})
```

### Nested Routes

Create a parent route with `Outlet` for nested routes:

```tsx
// /dashboard/parent/index.tsx
export const Route = createFileRoute('/dashboard/parent')({
	component: () => <Outlet />,
})

// /dashboard/parent/child.tsx
export const Route = createFileRoute('/dashboard/parent/child')({
	component: ChildComponent,
})
```

## Authentication

Authentication and role checks are handled automatically by the parent layouts:

- `src/routes/dashboard.tsx` handles authentication for all dashboard routes
- `src/routes/dashboard/admin.tsx` handles admin role check for all admin routes
- Routes under `/_marketing/*` are public
- Routes under `/(auth)/*` handle authentication flow

You don't need to add any explicit auth checks in your route files - just place
them in the correct directory and the parent layout will handle the protection.
