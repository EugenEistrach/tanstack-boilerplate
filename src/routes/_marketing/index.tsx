import { CheckIcon } from '@radix-ui/react-icons'
import { createFileRoute, Link } from '@tanstack/react-router'

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
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/_marketing/')({
	component: LandingPage,
})

function LandingPage() {
	const auth = useOptionalAuth()

	return (
		<>
			<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
								{m.hero_title()}
							</h1>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								{m.hero_subtitle()}
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user ? m.go_to_app() : m.get_started()}
								</Link>
							</Button>
							<Button variant="outline">{m.learn_more()}</Button>
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
						{m.features_title()}
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card>
							<CardHeader>
								<CardTitle>{m.feature_tanstack_title()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.feature_tanstack_description()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.feature_ui_title()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.feature_ui_description()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.feature_auth_title()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.feature_auth_description()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.feature_data_title()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.feature_data_description()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.feature_i18n_title()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.feature_i18n_description()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.feature_background_title()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.feature_background_description()}</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
						{m.pricing_title()}
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{m.plan_starter_title()}</CardTitle>
								<CardDescription>
									{m.plan_starter_description()}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">{m.plan_starter_price()}</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_starter_feature_1()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_starter_feature_2()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_starter_feature_3()}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">{m.choose_plan()}</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{m.plan_pro_title()}</CardTitle>
								<CardDescription>{m.plan_pro_description()}</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">{m.plan_pro_price()}</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_pro_feature_1()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_pro_feature_2()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_pro_feature_3()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_pro_feature_4()}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">{m.choose_plan()}</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{m.plan_enterprise_title()}</CardTitle>
								<CardDescription>
									{m.plan_enterprise_description()}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">
									{m.plan_enterprise_price()}
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_enterprise_feature_1()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_enterprise_feature_2()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_enterprise_feature_3()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_enterprise_feature_4()}
									</li>
									<li className="flex items-center">
										<CheckIcon className="mr-2 h-4 w-4 text-green-500" />
										{m.plan_enterprise_feature_5()}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">{m.choose_plan()}</Button>
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
								{m.cta_title()}
							</h2>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								{m.cta_subtitle()}
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user ? m.go_to_app() : m.get_started()}
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
