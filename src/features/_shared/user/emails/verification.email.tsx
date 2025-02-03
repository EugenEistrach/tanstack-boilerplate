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

interface VerificationEmailProps {
	verificationLink: string
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

export const VerificationEmail = ({
	verificationLink,
	userEmail,
}: VerificationEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>{m.calm_rapid_panda_glow()}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>{m.wise_proud_sheep_float()}</Heading>
					<Text style={text}>
						{userEmail
							? m.neat_young_otter_heal({ email: userEmail })
							: m.rare_cold_penguin_march()}{' '}
						{m.warm_quick_fox_jump()}
					</Text>
					<Section style={{ textAlign: 'center', margin: '32px 0' }}>
						<Button style={button} href={verificationLink}>
							{m.blue_happy_deer_dance()}
						</Button>
					</Section>
					<Text style={{ ...text, fontSize: '14px' }}>
						{m.soft_wild_bear_run()}
					</Text>
					<Hr
						style={{
							margin: '16px 0',
							border: 'none',
							borderTop: '1px solid #E5E7EB',
						}}
					/>
					<Text style={footer}>
						{m.dark_busy_wolf_howl()}{' '}
						<Link style={anchor} href={verificationLink}>
							{verificationLink}
						</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	)
}
