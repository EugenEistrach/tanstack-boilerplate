import { isCancel, spinner } from '@clack/prompts'
import { type, type Type } from 'arktype'

const s = spinner()

interface WaitForActionParams<T> {
	action: () => Promise<T>
	waitingMessage: string
	successMessage: string
	errorMessage: string
}

export async function waitForAutomatedAction<T>({
	action,
	waitingMessage,
	successMessage,
	errorMessage,
}: WaitForActionParams<T>): Promise<T> {
	try {
		s.start(waitingMessage)
		const result = await action()
		s.stop(successMessage)
		return result
	} catch (error) {
		s.stop(errorMessage, 1)
		if (error instanceof Error) {
			throw error
		}
		throw new Error('Unknown error occurred')
	}
}

export async function waitForCheck({
	action,
	waitingMessage,
	successMessage,
	errorMessage,
}: WaitForActionParams<boolean>): Promise<boolean> {
	try {
		s.start(waitingMessage)
		const result = await action()
		if (result) {
			s.stop(successMessage)
			return true
		} else {
			s.stop(errorMessage, 1)
			return false
		}
	} catch (error) {
		s.stop(errorMessage, 1)
		if (error instanceof Error) {
			throw error
		}
		throw new Error('Unknown error occurred')
	}
}

export function validate(schema: Type) {
	return (value: unknown) => {
		const result = schema(value)
		if (result instanceof type.errors) {
			return result.summary
		}
		return undefined
	}
}

export function ensureNotCanceled<T>(result: T | symbol) {
	if (isCancel(result)) {
		throw new Error('Operation cancelled')
	}

	return result
}
