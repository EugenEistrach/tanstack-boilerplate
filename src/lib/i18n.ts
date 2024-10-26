import { useMutation } from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/start'
import { setCookie } from 'vinxi/http'
import { languageTag, type AvailableLanguageTag } from './paraglide/runtime'

export const $updateLocale = createServerFn(
	'POST',
	async (locale: AvailableLanguageTag) => {
		setCookie('lang', locale)
	},
)

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
