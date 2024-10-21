import { type ReactElement } from 'react'
import { Resend } from 'resend'
import { serverEnv } from '../lib/env.server'

const resend = serverEnv.RESEND_API_KEY
	? new Resend(serverEnv.RESEND_API_KEY)
	: null

export async function sendEmail({
	to,
	subject,
	react,
}: {
	to: string
	subject: string
	react: ReactElement
}) {
	if (!resend || !serverEnv.EMAIL_FROM) {
		console.log(`Simulating email send: ${subject}, to: ${to}, html: ${react}`)
		return
	}

	await resend.emails.send({
		from: serverEnv.EMAIL_FROM,
		to,
		subject,
		react,
	})
}
