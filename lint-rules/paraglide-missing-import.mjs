/** @type {import('eslint').Rule.RuleModule} */
export const paraglideMissingImport = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce paraglide messages import when using m.',
			category: 'Imports',
			recommended: true,
		},
		fixable: 'code',
		schema: [],
	},

	create(context) {
		let hasParaglideImport = false

		return {
			// Check if the import already exists
			ImportDeclaration(node) {
				if (!node.source || typeof node.source.value !== 'string') return
				if (node.source.value !== '@/lib/paraglide/messages') return

				const hasNamespaceImport = node.specifiers.some((spec) => {
					if (spec.type !== 'ImportNamespaceSpecifier') return false
					if (spec.local.type !== 'Identifier') return false
					return spec.local.name === 'm'
				})

				if (hasNamespaceImport) {
					hasParaglideImport = true
				}
			},

			// Check for m. usage
			MemberExpression(node) {
				const { object } = node
				if (
					object.type !== 'Identifier' ||
					object.name !== 'm' ||
					hasParaglideImport
				)
					return

				context.report({
					node,
					message: 'Missing paraglide messages import',
					fix: (fixer) => {
						const program = context.getSourceCode().ast
						const firstNode = program.body[0]
						if (!firstNode) return null

						return fixer.insertTextBefore(
							firstNode,
							"import * as m from '@/lib/paraglide/messages';\n",
						)
					},
				})
			},
		}
	},
}
