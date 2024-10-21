import { getHintUtils } from '@epic-web/client-hints'
import { clientHint as timeZoneHint } from '@epic-web/client-hints/time-zone'
import { createServerFn } from '@tanstack/start'

const hintsUtils = getHintUtils({
	timeZone: timeZoneHint,
})

const { getHints } = hintsUtils

export const $getHints = createServerFn('GET', async (_, ctx) => {
	return getHints(ctx.request)
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
