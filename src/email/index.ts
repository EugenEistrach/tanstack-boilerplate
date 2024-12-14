import { type ReactElement } from 'react'
import { Resend } from 'resend'
import { env } from '@/lib/server/env.server'

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

export async function sendEmail({
	to,
	subject,
	react,
}: {
	to: string
	subject: string
	react: ReactElement
}) {
	if (!resend || !env.EMAIL_FROM) {
		console.log(`Simulating email send: ${subject}, to: ${to}, html: ${react}`)
		return
	}

	await resend.emails.send({
		from: env.EMAIL_FROM,
		to,
		subject,
		react,
	})
}
