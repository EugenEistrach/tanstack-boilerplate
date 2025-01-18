/** @type {import('eslint').Rule.RuleModule} */
export const enforceServerFnPrefix = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				"Enforce '$' prefix for variables created with createServerFn",
			category: 'Stylistic Issues',
			recommended: false,
		},
		fixable: 'code',
		schema: [],
	},

	create(context) {
		function findCreateServerFnCall(node) {
			if (!node) return false
			if (node.type === 'Identifier' && node.name === 'createServerFn')
				return true
			if (node.type === 'MemberExpression')
				return findCreateServerFnCall(node.object)
			if (node.type === 'CallExpression')
				return findCreateServerFnCall(node.callee)
			return false
		}

		return {
			VariableDeclarator(node) {
				if (!node.init) return

				// Handle both direct calls and chained calls (like .validator().handler())
				const isServerFn = findCreateServerFnCall(node.init)

				if (isServerFn) {
					const variableName = node.id.name
					if (!variableName.startsWith('$')) {
						context.report({
							node: node.id,
							message:
								"Variable name created with createServerFn should start with '$'",
							fix: (fixer) => {
								return fixer.replaceText(node.id, '$' + variableName)
							},
						})
					}
				}
			},
		}
	},
}
