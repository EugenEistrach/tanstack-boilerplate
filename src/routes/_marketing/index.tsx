import { CheckIcon } from '@radix-ui/react-icons'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslations } from 'use-intl'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useOptionalAuth } from '@/lib/auth.client'

export const Route = createFileRoute('/_marketing/')({
	component: LandingPage,
})

function LandingPage() {
	const auth = useOptionalAuth()
	const t = useTranslations()

	return (
		<>
			<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
								{t('marketing.hero.title')}
							</h1>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								{t('marketing.hero.subtitle')}
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user
										? t('marketing.goToApp')
										: t('marketing.getStarted')}
								</Link>
							</Button>
							<Button variant="outline">{t('marketing.learnMore')}</Button>
						</div>
					</div>
				</div>
			</section>
			<section
				id="features"
				className="w-full bg-secondary py-12 text-secondary-foreground md:py-24 lg:py-32"
			>
				<div className="container px-4 md:px-6">
					<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
						{t('marketing.features.title')}
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card>
							<CardHeader>
								<CardTitle>{t('marketing.features.tanstack.title')}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t('marketing.features.tanstack.description')}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{t('marketing.features.ui.title')}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t('marketing.features.ui.description')}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{t('marketing.features.auth.title')}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t('marketing.features.auth.description')}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{t('marketing.features.data.title')}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t('marketing.features.data.description')}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{t('marketing.features.i18n.title')}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t('marketing.features.i18n.description')}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>
									{t('marketing.features.background.title')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t('marketing.features.background.description')}</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
						{t('marketing.pricing.title')}
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{t('marketing.pricing.starter.title')}</CardTitle>
								<CardDescription>
									{t('marketing.pricing.starter.description')}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">
									{t('marketing.pricing.starter.price')}
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.starter.features.1')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.starter.features.2')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.starter.features.3')}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">
									{t('marketing.pricing.choosePlan')}
								</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{t('marketing.pricing.pro.title')}</CardTitle>
								<CardDescription>
									{t('marketing.pricing.pro.description')}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">
									{t('marketing.pricing.pro.price')}
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.pro.features.1')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.pro.features.2')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.pro.features.3')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.pro.features.4')}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">
									{t('marketing.pricing.choosePlan')}
								</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{t('marketing.pricing.enterprise.title')}</CardTitle>
								<CardDescription>
									{t('marketing.pricing.enterprise.description')}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">
									{t('marketing.pricing.enterprise.price')}
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.enterprise.features.1')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.enterprise.features.2')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.enterprise.features.3')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.enterprise.features.4')}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{t('marketing.pricing.enterprise.features.5')}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">
									{t('marketing.pricing.choosePlan')}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</section>
			<section className="w-full bg-secondary py-12 text-secondary-foreground md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								{t('marketing.cta.title')}
							</h2>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								{t('marketing.cta.subtitle')}
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user
										? t('marketing.goToApp')
										: t('marketing.getStarted')}
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
