import { useMutation } from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/start'
import { setCookie } from '@tanstack/start/server'
import * as v from 'valibot'
import { languageTag } from '@/lib/paraglide/runtime'

export const $updateLocale = createServerFn({ method: 'POST' })
	.validator(
		v.object({
			locale: v.string(),
		}),
	)
	.handler(async ({ data: { locale } }) => {
		setCookie('lang', locale)
	})

export const useChangeLocaleMutation = () => {
	const changeLocaleMutation = useMutation({
		mutationFn: useServerFn($updateLocale),
		onSuccess: () => {
			window.location.reload()
		},
	})
	return changeLocaleMutation
}

export const useLocale = () => languageTag()
