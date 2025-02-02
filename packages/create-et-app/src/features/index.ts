import { type CliVerificationResults } from '@/check-cli-dependencies.js'

export type AvailableFeatures =
	| 'githubRepo'
	| 'fly'
	| 'githubOauth'
	| 'trigger'
	| 'turso'

export type FlySecrets = {
	ADMIN_USER_EMAILS?: string
	API_KEY?: string
	SESSION_SECRET?: string
	APPLICATION_URL?: string
	TURSO_DATABASE_URL?: string
	TURSO_AUTH_TOKEN?: string
	TRIGGER_API_KEY?: string
}

export type TriggerSecrets = {
	APPLICATION_URL?: string
	API_KEY?: string
	TURSO_DATABASE_URL?: string
	TURSO_AUTH_TOKEN?: string
}

export type GitHubSecrets = {
	TRIGGER_ACCESS_TOKEN?: string
	FLY_API_TOKEN?: string
}

export type FeatureContext = {
	projectName: string
	projectDir: string
	selectedFeatures: AvailableFeatures[]
	completedFeatures: AvailableFeatures[]
	flySecretsToSet: FlySecrets
	triggerSecretsToSet: TriggerSecrets
	githubSecretsToSet: GitHubSecrets
	cliStatus: CliVerificationResults
	triggerProjectId?: string
}

export type Feature<T extends AvailableFeatures> = {
	code: T
	label: string
	hint?: string
	onSelected: (ctx: FeatureContext) => Promise<Result | undefined | void>
	onSkipped?: (ctx: FeatureContext) => Promise<void>
	manualInstructions?: string[]
}

export type Result = {
	flySecrets?: FlySecrets
	triggerSecrets?: TriggerSecrets
	githubSecrets?: GitHubSecrets
}

export function feature<T extends AvailableFeatures>(
	code: T,
	feature: Omit<Feature<T>, 'code'>,
) {
	return {
		...feature,
		code,
	}
}
