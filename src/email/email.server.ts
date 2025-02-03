import { render } from '@react-email/components'
import { type ReactElement } from 'react'
import { Resend, type CreateEmailResponse } from 'resend'
import { env } from '@/lib/server/env.server'
import { logger } from '@/lib/server/logger.server'

let resend: Resend | undefined

type EmailOptions =
	| { html: string; text: string; react?: never }
	| { react: ReactElement; html?: never; text?: never }

export async function sendEmail({
	to,
	subject,
	...options
}: {
	to: string
	subject: string
} & EmailOptions) {
	const from = env.EMAIL_FROM || 'hello@et-stack.dev'

	const email = {
		from,
		to,
		subject,
		...(await getHtmlAndText(options)),
	}

	if (!env.RESEND_API_KEY && !env.MOCKS) {
		logger.error(`RESEND_API_KEY not set and we're not in mocks mode.`)
		logger.error(`To send emails, set the RESEND_API_KEY environment variable.`)
		logger.error(
			{
				email,
				operation: 'sendEmail',
			},
			`Would have sent the following email`,
		)
		return {
			data: { id: 'mocked' },
			error: null,
		} as const satisfies CreateEmailResponse
	}

	try {
		if (!resend) {
			resend = new Resend(env.RESEND_API_KEY)
		}
		const result = await resend.emails.send(email)
		if (result.error) {
			throw result.error
		}
		logger.info({ email, operation: 'sendEmail', result }, `Email sent`)
		return result
	} catch (err) {
		logger.error({ email, operation: 'sendEmail', err }, `Failed to send email`)
		return {
			data: { id: 'mocked' },
			error: {
				message: 'Failed to send email',
				name: 'internal_server_error',
			},
		} as const satisfies CreateEmailResponse
	}
}

async function getHtmlAndText(opts: EmailOptions) {
	if (!opts.react) {
		return { html: opts.html, text: opts.text }
	}

	const [html, text] = await Promise.all([
		render(opts.react),
		render(opts.react, { plainText: true }),
	])
	return { html, text }
}
