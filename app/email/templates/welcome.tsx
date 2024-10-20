import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from '@react-email/components'
import type * as React from 'react'

interface WelcomeEmailProps {
	username: string
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ username }) => (
	<Html>
		<Head />
		<Preview>Welcome to Our Awesome Boilerplate Project!</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={content}>
					<Heading style={h1}>Welcome, {username}!</Heading>
					<Text style={text}>
						We're thrilled to have you on board. Our boilerplate project is
						designed to kickstart your development process and save you valuable
						time.
					</Text>
					<Text style={text}>
						Here are some key features of our boilerplate:
					</Text>
					<ul style={list}>
						<li>TanStack Start!</li>
						<li>TypeScript for type-safe development</li>
						<li>
							Shadcn UI and Tailwind CSS for beautiful, responsive designs
						</li>
					</ul>
					<Hr style={hr} />
					<Text style={footer}>
						Need help? Check out our documentation or reach out to our support
						team.
					</Text>
				</Section>
			</Container>
		</Body>
	</Html>
)

export default WelcomeEmail

const main = {
	backgroundColor: '#f6f9fc',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
	backgroundColor: '#ffffff',
	margin: '0 auto',
	padding: '24px 0',
	marginBottom: '64px',
	maxWidth: '600px',
	borderRadius: '4px',
	boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}

const content = {
	padding: '0 48px',
}

const h1 = {
	color: '#333',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: '24px',
	fontWeight: 'bold',
	margin: '40px 0',
	padding: '0',
	textAlign: 'center' as const,
}

const text = {
	color: '#333',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: '16px',
	lineHeight: '24px',
	textAlign: 'left' as const,
}

const list = {
	color: '#333',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: '16px',
	lineHeight: '24px',
	paddingLeft: '24px',
}

const hr = {
	borderColor: '#e6ebf1',
	margin: '20px 0',
}

const footer = {
	color: '#8898aa',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: '12px',
	lineHeight: '16px',
}
