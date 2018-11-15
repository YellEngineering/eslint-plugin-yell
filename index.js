module.exports = {
	rules: {
		defineBabelES6: {
			meta: {
				docs: {
					description: 'Always require babelHelpers in define statement for ES6 files',
					category: 'Yell - JS Best Practices',
					recommended: true
				}
			},
			create(context) {
				return {
					Identifier(node) {

						/**
						 * stop if not an es6 file
						 */
						let isES6File = /(.*).es6$/.test(context.getFilename());
						if ( !isES6File ) {
							return;
						}

						// check if node is define?
						const isDefine = node.name.toLowerCase() === 'define';
						const isCallExpression = node.parent.type === 'CallExpression';

						const isDefineNode = isDefine && isCallExpression;

						// stop if not a define node
						if (!isDefineNode) {
							return;
						}

						// get all the arguments of the define node
						const args = node.parent.arguments;

						// get array in define
						const ArrayExpression = args.find(item => item.type === "ArrayExpression");

						// get function callback in define
						const FunctionExpression = args.find(item => item.type === "FunctionExpression");

						// check if babelHelpers exists as a value in array
						const babelExistsInArray = ArrayExpression && ArrayExpression.elements.find(item => item.value === 'babelHelpers');

						// check if babelHelpers exists as a parameter in function callback
						const babelExistsInFunction = FunctionExpression && FunctionExpression.params.find(item => item.name === 'babelHelpers');

						// create display message
						let message = '';
						if (!babelExistsInArray) {
							message = 'babelHelpers missing in define Array'
						} else if (!babelExistsInFunction) {
							message = 'babelHelpers missing in define function callback'
						}

						// if message is not empty lint as error!
						if (message) {
							context.report({
								node,
								message
							});
						}
					}
				};
			}
		}
	}
};
