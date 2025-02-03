import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components'
import * as m from '@/lib/paraglide/messages'

interface ForgotPasswordEmailProps {
	resetLink: string
	userEmail?: string
}

const main = {
	backgroundColor: '#ffffff',
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
	margin: '0 auto',
	padding: '32px 16px',
	maxWidth: '42.5rem',
}

const heading = {
	fontSize: '24px',
	fontWeight: '600',
	textAlign: 'center' as const,
	margin: '16px 0',
	color: '#18181B',
}

const text = {
	fontSize: '16px',
	lineHeight: '24px',
	color: '#4B5563',
	margin: '16px 0',
}

const button = {
	backgroundColor: 'hsl(222.2 47.4% 11.2%)',
	borderRadius: '6px',
	color: '#fff',
	fontSize: '16px',
	fontWeight: '500',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'inline-block',
	padding: '12px 24px',
}

const anchor = {
	color: '#2563EB',
	textDecoration: 'underline',
}

const footer = {
	fontSize: '12px',
	color: '#9CA3AF',
	textAlign: 'center' as const,
	margin: '16px 0',
}

export const ForgotPasswordEmail = ({
	resetLink,
	userEmail,
}: ForgotPasswordEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>{m.aqua_great_swan_blink()}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>{m.ornate_livid_mammoth_twist()}</Heading>
					<Text style={text}>
						{userEmail
							? m.brave_dirty_earthworm_edit({ email: userEmail })
							: m.zany_empty_lionfish_bless()}{' '}
						{m.light_orange_falcon_absorb()}
					</Text>
					<Section style={{ textAlign: 'center', margin: '32px 0' }}>
						<Button style={button} href={resetLink}>
							{m.light_minor_cockroach_hurl()}
						</Button>
					</Section>
					<Text style={{ ...text, fontSize: '14px' }}>
						{m.stale_silly_shrike_hike()}
					</Text>
					<Hr
						style={{
							margin: '16px 0',
							border: 'none',
							borderTop: '1px solid #E5E7EB',
						}}
					/>
					<Text style={footer}>
						{m.east_bold_porpoise_walk()}{' '}
						<Link style={anchor} href={resetLink}>
							{resetLink}
						</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	)
}

export const createForgotPasswordEmail = ({
	resetLink,
	userEmail,
}: ForgotPasswordEmailProps) => {
	return <ForgotPasswordEmail resetLink={resetLink} userEmail={userEmail} />
}

export default ForgotPasswordEmail
