import { createFileRoute } from '@tanstack/react-router'
import { type } from 'arktype'
import { VerificationRequiredCard } from '@/features/_shared/user/ui/verification-required-card'

const searchType = type({
	email: 'string.email',
})

export const Route = createFileRoute('/_auth/verify-email')({
	validateSearch: searchType,
	component: VerificationRequiredCard,
})
