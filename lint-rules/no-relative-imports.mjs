/** @type {import('eslint').Rule.RuleModule} */
export const noRelativeImports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Enforce absolute imports using @/ except for sibling and children imports',
		},
	},
	create(context) {
		return {
			ImportDeclaration(node) {
				if (!node.source || typeof node.source.value !== 'string') return

				const source = node.source.value

				// Skip if not a relative import
				if (!source.startsWith('.')) return

				// Allow sibling and children imports
				if (source.startsWith('./')) return

				// Report parent directory imports
				if (source.startsWith('../')) {
					context.report({
						node,
						message:
							'Use absolute imports with @/ instead of relative parent paths',
					})
				}
			},
		}
	},
}
