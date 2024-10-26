// Some convenience stuff until the new server functions drop :D

import * as v from 'valibot'

// export type FlattenedError<T> = {
// 	fieldErrors: { [K in keyof T]?: string[] }
// 	formErrors: string[]
// }

// export class ValidationError<T> extends Error {
// 	constructor(public errors: FlattenedError<T>) {
// 		super('Validation Error')
// 		this.name = 'ValidationError'
// 	}
// }

export function createValidationClient() {
	return {
		input: <T extends v.ObjectSchema<any, any>>(
			schemaOrFactory: T | (() => T | Promise<T>),
		) => ({
			handler:
				<R>(fn: (input: { parsedInput: v.InferOutput<T> }) => Promise<R>) =>
				async (
					rawInput: v.InferInput<T>,
				): Promise<[R, null] | [null, Array<v.InferIssue<T>>]> => {
					try {
						const schema =
							typeof schemaOrFactory === 'function'
								? await schemaOrFactory()
								: schemaOrFactory
						const parsedInput = await v.safeParseAsync(schema, rawInput)

						if (!parsedInput.success) {
							return new Response(JSON.stringify([null, parsedInput.issues]), {
								status: 400,
							}) as unknown as [null, Array<v.InferIssue<T>>]
						}

						const result = await fn({ parsedInput: parsedInput.output })
						return [result, null]
					} catch (error) {
						throw error
					}
				},
		}),
	}
}

export const validationClient = createValidationClient()
