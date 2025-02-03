import { createFileRoute, Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useOptionalAuth } from '@/features/_shared/user/api/auth.api'
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
								{m.bald_topical_skate_scold()}
							</h1>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								{m.vexed_wacky_mantis_earn()}
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user ? m.proud_cool_gopher_amaze() : m.smart_plane_florian_startle()}
								</Link>
							</Button>
							<Button variant="outline">{m.crisp_weird_grebe_blend()}</Button>
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
						{m.left_true_buzzard_dream()}
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card>
							<CardHeader>
								<CardTitle>{m.weak_major_capybara_learn()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.dark_seemly_jackdaw_bake()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.loose_seemly_lemming_sew()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.odd_due_javelina_hush()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.late_chunky_termite_jolt()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.brave_royal_tortoise_rest()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.each_tired_turtle_climb()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.trite_next_polecat_bask()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.soft_wide_chipmunk_flip()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.new_zesty_shrike_support()}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>{m.mushy_noble_cheetah_create()}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{m.bright_pretty_eel_catch()}</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
						{m.dizzy_many_liger_lock()}
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{m.mushy_many_myna_reside()}</CardTitle>
								<CardDescription>
									{m.sad_soft_coyote_sprout()}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">{m.white_calm_seahorse_pride()}</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.new_loud_bird_arrive()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.key_caring_chipmunk_link()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.away_gray_turkey_launch()}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">{m.weary_large_carp_aspire()}</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{m.crazy_grassy_eagle_intend()}</CardTitle>
								<CardDescription>{m.proof_fun_snake_quell()}</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">{m.ok_spicy_hornet_leap()}</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.home_broad_pig_prosper()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.tired_proud_puffin_enjoy()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.weary_vexed_gopher_dine()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.fun_neat_loris_quell()}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">{m.weary_large_carp_aspire()}</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>{m.awful_suave_dove_walk()}</CardTitle>
								<CardDescription>
									{m.fluffy_tense_angelfish_hunt()}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">
									{m.vexed_next_slug_build()}
								</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.weary_dull_marmot_bloom()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.kind_candid_canary_devour()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.basic_tired_turtle_dial()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.equal_white_lemur_bend()}
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										{m.agent_spicy_clownfish_pat()}
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">{m.weary_large_carp_aspire()}</Button>
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
								{m.vivid_low_flea_scoop()}
							</h2>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								{m.simple_bland_jaguar_view()}
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user ? m.proud_cool_gopher_amaze() : m.smart_plane_florian_startle()}
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
