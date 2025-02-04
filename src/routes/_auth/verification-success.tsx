import { createFileRoute } from '@tanstack/react-router'
import { VerificationSuccessCard } from '@/features/_shared/user/ui/auth/verification-success-card'

export const Route = createFileRoute('/_auth/verification-success')({
	component: RouteComponent,
})

function RouteComponent() {
	return <VerificationSuccessCard />
}
