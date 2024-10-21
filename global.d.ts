import type en from './i18n/en.json'

type Messages = typeof en

declare global {
	// Use type safe message keys with `next-intl`
	interface IntlMessages extends Messages {}
}

declare module '@tanstack/react-router' {
	interface StaticDataRouteOption {}
}
