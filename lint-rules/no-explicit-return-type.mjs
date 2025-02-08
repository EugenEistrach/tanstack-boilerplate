// lint-rules/no-explicit-return-type.mjs
export const noExplicitReturnType = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow explicit return types on functions',
			category: 'Stylistic Issues',
			recommended: 'warn',
		},
		fixable: 'code',
		schema: [], // no options
	},
	create: function (context) {
		function isOverload(node) {
			const parent = node.parent
			if (parent.type === 'Program' || parent.type === 'BlockStatement') {
				const body = parent.body
				const index = body.indexOf(node)
				if (
					index > 0 &&
					body[index - 1].type === 'FunctionDeclaration' &&
					body[index - 1].id.name === node.id.name
				) {
					return true
				}
			}
			return false
		}

		function isTypePredicate(returnType) {
			return (
				returnType &&
				returnType.type === 'TSTypeAnnotation' &&
				returnType.typeAnnotation.type === 'TSTypePredicate'
			)
		}

		return {
			FunctionDeclaration(node) {
				if (isOverload(node)) return // Skip overloads
				if (node.returnType && !isTypePredicate(node.returnType)) {
					context.report({
						node: node.returnType,
						message:
							'Avoid explicit return types on functions. Use type inference instead.',
						fix: function (fixer) {
							return fixer.remove(node.returnType)
						},
					})
				}
			},
			ArrowFunctionExpression(node) {
				if (node.returnType && !isTypePredicate(node.returnType)) {
					context.report({
						node: node.returnType,
						message:
							'Avoid explicit return types on functions. Use type inference instead.',
						fix: function (fixer) {
							return fixer.remove(node.returnType)
						},
					})
				}
			},
		}
	},
}
