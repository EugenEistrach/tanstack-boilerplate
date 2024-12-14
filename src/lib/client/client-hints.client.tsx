import { getHintUtils } from '@epic-web/client-hints'
import { clientHint as colorSchemeHint } from '@epic-web/client-hints/color-scheme'
import { clientHint as timeZoneHint } from '@epic-web/client-hints/time-zone'
import { createServerFn } from '@tanstack/start'
import { getWebRequest } from 'vinxi/http'

const hintsUtils = getHintUtils({
	timeZone: timeZoneHint,
	colorScheme: colorSchemeHint,
})

const { getHints } = hintsUtils

export const $getHints = createServerFn({ method: 'GET' }).handler(async () => {
	const request = getWebRequest()
	return getHints(request)
})

export function ClientHintChecker() {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: hintsUtils.getClientHintCheckScript(),
			}}
		/>
	)
}
