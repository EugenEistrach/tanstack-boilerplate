/// <reference types="vinxi/types/client" />
import Headers from '@mjackson/headers'
import { StartClient } from '@tanstack/start'
import { hydrateRoot } from 'react-dom/client'
import {
	type AvailableLanguageTag,
	availableLanguageTags,
	setLanguageTag,
} from './lib/paraglide/runtime'
import { createRouter } from './router'

const router = createRouter()

const headers = new Headers({
	cookie: document.cookie,
})

const isSupportedLanguage = (
	language: string,
): language is AvailableLanguageTag => {
	return availableLanguageTags.includes(language as any)
}

const lang = headers.cookie.get('lang') ?? availableLanguageTags[0]
if (lang && isSupportedLanguage(lang)) {
	setLanguageTag(lang)
}

// @ts-ignore
hydrateRoot(document.getElementById('root'), <StartClient router={router} />)
