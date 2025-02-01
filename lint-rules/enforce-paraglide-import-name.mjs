/** @type {import('eslint').Rule.RuleModule} */
export const enforceParaglideImportName = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce using "m" as import name for paraglide messages',
			recommended: 'error',
		},
		fixable: 'code',
		schema: [],
	},

	create(context) {
		return {
			ImportDeclaration(node) {
				if (node.source.value === '@/lib/paraglide/messages') {
					const importSpecifier = node.specifiers[0]
					if (
						importSpecifier?.type === 'ImportNamespaceSpecifier' &&
						importSpecifier.local.name !== 'm'
					) {
						context.report({
							node: importSpecifier,
							message: 'Paraglide messages must be imported as "m"',
							fix: (fixer) => {
								return fixer.replaceText(importSpecifier, '* as m')
							},
						})
					}
				}
			},
			MemberExpression(node) {
				if (
					node.object.type === 'Identifier' &&
					node.object.name === 'messages'
				) {
					context.report({
						node: node.object,
						message: 'Use "m" instead of "messages" for paraglide imports',
						fix: (fixer) => {
							return fixer.replaceText(node.object, 'm')
						},
					})
				}
			},
		}
	},
}
