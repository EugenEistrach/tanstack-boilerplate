/// <reference types="vinxi/types/client" />
import Headers from '@mjackson/headers'
import { StartClient } from '@tanstack/start'
import { hydrateRoot } from 'react-dom/client'
import { createRouter } from './router'
import { availableLanguageTags, setLanguageTag } from '@/lib/paraglide/runtime'
import { isSupportedLanguage } from '@/lib/shared/i18n'

const router = createRouter()

const headers = new Headers({
	cookie: document.cookie,
})

const lang = headers.cookie.get('lang') ?? availableLanguageTags[0]
if (lang && isSupportedLanguage(lang)) {
	setLanguageTag(lang)
}

hydrateRoot(document, <StartClient router={router} />)
