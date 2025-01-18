/** @type {import('eslint').Rule.RuleModule} */
export const loggerErrorFormat = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce logger format conventions',
			category: 'Best Practices',
			recommended: true,
		},
		fixable: 'code',
		schema: [],
	},

	create(context) {
		// Track our logger import
		let ourLoggerName = null

		function checkArgumentOrder(node, args) {
			if (args.length <= 1) return false

			const firstArg = args[0]
			const secondArg = args[1]

			// If first arg is string/template and second is object, we need to fix the order
			if (
				((firstArg.type === 'Literal' && typeof firstArg.value === 'string') ||
					firstArg.type === 'TemplateLiteral') &&
				secondArg.type === 'ObjectExpression'
			) {
				const sourceCode = context.getSourceCode()
				context.report({
					node,
					message:
						'When passing an object to logger methods, it must be the first argument',
					fix: (fixer) => {
						const objectText = sourceCode.getText(secondArg)
						const messageText = sourceCode.getText(firstArg)
						const range = [args[0].range[0], args[1].range[1]]
						return fixer.replaceTextRange(
							range,
							`${objectText}, ${messageText}`,
						)
					},
				})
				return true
			}
			return false
		}

		return {
			ImportDeclaration(node) {
				// Only track the logger from our server module
				if (node.source.value === '@/lib/server/logger.server') {
					const specifier = node.specifiers.find(
						(s) => s.type === 'ImportSpecifier' && s.imported.name === 'logger',
					)
					if (specifier) {
						ourLoggerName = specifier.local.name
					}
				}
			},

			CallExpression(node) {
				// Only check calls to our logger
				if (
					!ourLoggerName ||
					node.callee.type !== 'MemberExpression' ||
					node.callee.object.type !== 'Identifier' ||
					node.callee.object.name !== ourLoggerName ||
					node.callee.property.type !== 'Identifier'
				) {
					return
				}

				const method = node.callee.property.name
				const args = node.arguments

				// All logger calls must have at least one argument
				if (args.length === 0) {
					context.report({
						node,
						message: 'Logger calls must have at least one argument',
					})
					return
				}

				// Always check argument order first
				const hasOrderIssue = checkArgumentOrder(node, args)
				if (hasOrderIssue) return

				// For error method, check additional rules only if first arg is already an object
				if (method === 'error' && args[0].type === 'ObjectExpression') {
					// Must have a message string as second argument
					if (
						args.length < 2 ||
						(args[1].type !== 'Literal' && args[1].type !== 'TemplateLiteral')
					) {
						context.report({
							node,
							message: 'Logger calls must include a message string',
						})
						return
					}

					// Check if operation field exists in the object
					const hasOperation = args[0].properties.some(
						(prop) =>
							prop.type === 'Property' &&
							prop.key.type === 'Identifier' &&
							prop.key.name === 'operation',
					)

					if (!hasOperation) {
						context.report({
							node: args[0],
							message: 'Logger error object must include an operation field',
						})
					}

					// If error is passed, it should be named 'err'
					const errorProp = args[0].properties.find(
						(prop) =>
							prop.type === 'Property' &&
							prop.key.type === 'Identifier' &&
							(prop.key.name === 'error' || prop.key.name === 'err'),
					)

					if (errorProp && errorProp.key.name === 'error') {
						context.report({
							node: errorProp,
							message: 'Error property should be named "err" not "error"',
							fix: (fixer) => {
								return fixer.replaceText(errorProp.key, 'err')
							},
						})
					}
				} else {
					// For other methods (info, warn, debug, etc.)
					// If first argument is not an object or string, report error
					if (
						args[0].type !== 'ObjectExpression' &&
						args[0].type !== 'Literal' &&
						args[0].type !== 'TemplateLiteral'
					) {
						context.report({
							node,
							message: 'Logger calls must include a message string',
						})
						return
					}

					// If first argument is object, must be followed by string
					if (
						args[0].type === 'ObjectExpression' &&
						(args.length < 2 ||
							(args[1].type !== 'Literal' &&
								args[1].type !== 'TemplateLiteral'))
					) {
						context.report({
							node,
							message:
								'When using an object, it must be followed by a message string',
						})
					}
				}
			},
		}
	},
}
