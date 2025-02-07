import { useQuery } from '@tanstack/react-query'
import { XCircle } from 'lucide-react'
import { useSpinDelay } from 'spin-delay'
import { UAParser } from 'ua-parser-js'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	activeSessionsQueryOptions,
	useSessionRevokeMutation,
} from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

interface UserAgentInfo {
	browser: string
	device: string
	raw: string
}

function parseUserAgent(userAgent: string | null | undefined): UserAgentInfo {
	if (!userAgent) {
		return {
			browser: m.blue_rapid_fox_dance(),
			device: m.blue_rapid_fox_dance(),
			raw: m.blue_rapid_fox_dance(),
		}
	}

	const parser = new UAParser(userAgent)
	const browser = parser.getBrowser()
	const os = parser.getOS()
	const device = parser.getDevice()

	const deviceInfo =
		device.vendor || device.model
			? `${device.vendor || ''} ${device.model || ''}`.trim()
			: os.name

	return {
		browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
		device: deviceInfo || 'Unknown Device',
		raw: userAgent,
	}
}

function SessionRowSkeleton() {
	return (
		<TableRow>
			<TableCell>
				<div className="space-y-2">
					<Skeleton className="h-4 w-[200px]" />
					<Skeleton className="h-3 w-[160px]" />
				</div>
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-[120px]" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-[180px]" />
			</TableCell>
			<TableCell className="text-right">
				<Skeleton className="ml-auto h-8 w-8" />
			</TableCell>
		</TableRow>
	)
}

export function ActiveSessionsCard() {
	const { data: sessions, isLoading } = useQuery(activeSessionsQueryOptions())
	const sessionRevokeMutation = useSessionRevokeMutation()
	const isPending = useSpinDelay(sessionRevokeMutation.isPending)

	return (
		<Card>
			<CardHeader>
				<CardTitle>{m.round_safe_snake_swim()}</CardTitle>
				<CardDescription>{m.warm_proud_hawk_soar()}</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{m.blue_rapid_fox_dance()}</TableHead>
							<TableHead>{m.pink_wise_deer_float()}</TableHead>
							<TableHead>{m.swift_proud_snake_soar()}</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<>
								<SessionRowSkeleton />
							</>
						) : (
							sessions?.map((session) => {
								const userAgentInfo = parseUserAgent(session.userAgent)
								return (
									<TableRow key={session.token}>
										<TableCell>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger className="text-left">
														<div>
															<div className="font-medium">
																{userAgentInfo.browser}
															</div>
															<div className="text-sm text-muted-foreground">
																{userAgentInfo.device}
															</div>
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-xs break-all">
															{userAgentInfo.raw}
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>
										<TableCell>{session.ipAddress || '-'}</TableCell>
										<TableCell>
											{new Date(session.updatedAt).toLocaleString()}
										</TableCell>
										<TableCell className="text-right">
											<TooltipProvider>
												<Tooltip delayDuration={50}>
													<TooltipTrigger asChild>
														<LoadingButton
															variant="ghost"
															size="icon"
															className="text-destructive"
															onClick={() =>
																sessionRevokeMutation.mutate({
																	token: session.token,
																})
															}
															disabled={isPending}
															loading={
																isPending &&
																sessionRevokeMutation.variables?.token ===
																	session.token
															}
															Icon={XCircle}
														></LoadingButton>
													</TooltipTrigger>
													<TooltipContent>
														{m.warm_rapid_snake_swim()}
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
