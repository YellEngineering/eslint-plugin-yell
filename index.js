module.exports = {
	rules: {
		amdForceParameter: {
			meta: {
				docs: {
					description: 'Always require babelHelpers in define statement for ES6 files',
					category: 'Yell - JS Best Practices',
					recommended: true
				}
			},
			schema: [
				{
					type: "object",
					properties: {
						params: {
							type: "array"
						},
						checkInArray: true,
						checkInFunction: true
					}
				}
			],
			create(context) {
				return {
					Identifier(node) {

						const options = context.options[0];
						const params = options['params'];

						/**
						 * stop if not an es6 file
						 */

						let filesToCheck = options['files'].some(item => context.getFilename().includes(item));

						if (!filesToCheck) {
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
						const ArrowFunctionExpression = args.find(item => item.type === "ArrowFunctionExpression");


						if ( options['checkInFunction'] ) {
							const FunctionExpressionContainsParams = FunctionExpression && FunctionExpression.params.find(item => params.some(param => item.name === param));
							const ArrowFunctionContainsParams = ArrowFunctionExpression && ArrowFunctionExpression.params.find(item => params.some(param => item.name === param));

							const paramExistsInFunction = FunctionExpressionContainsParams || ArrowFunctionContainsParams;

							if ( !paramExistsInFunction ) {
								context.report({
									node,
									message: 'babelHelpers missing in Define Function Callback'
								});
							}
						}


						if ( options['checkInArray'] ) {
							const ArrayExpressionContainsParam = ArrayExpression && ArrayExpression.elements.find(item => params.some(param => item.value === param));
							if ( !ArrayExpressionContainsParam ) {
								context.report({
									node,
									message: 'babelHelpers missing in Define Array'
								});
							}
						}



						// // determine if any of them contain babelHelpers
						// const FunctionExpressionContainsBabel = (FunctionExpression && FunctionExpression.params.find(item => item.name === SEARCHTERM));
						// const ArrowFunctionContainsBabel = (ArrowFunctionExpression && ArrowFunctionExpression.params.find(item => item.name === SEARCHTERM));

						// // check ifSEARCHTERMexists as a value in array
						// const babelExistsInArray = ArrayExpression && ArrayExpression.elements.find(item => item.value === SEARCHTERM);

						// // check if babelHelpers exists as a parameter in function callback
						// const babelExistsInFunction = FunctionExpressionContainsBabel || ArrowFunctionContainsBabel;
					}
				};
			}
		},

		amdPathChecker: {
			meta: {
				docs: {
					description: 'Ensure that references to files in DEFINE or REQUIRE have .es6 extension if they contain /',
					category: 'Yell - JS Best Practices',
					recommended: false
				}
			},

			schema: [
				{
					type: "object",
					properties: {
						excludePaths: {
							type: "array"
						},
					}
				}
			],

			create(context) {
				return {
					Identifier(node) {
						const options = context.options[0];
						const excludePaths = options['excludePaths'];
						const pathToCheckFor = options['checkFor'];
						const forceSlash = options['forceSlashInPath'];

						// check if node is define?
						const isDefineOrRequire = node.name.toLowerCase() === 'define' || node.name.toLowerCase() === 'require';
						const isCallExpression = node.parent.type === 'CallExpression';

						const isAMDNode = (isDefineOrRequire && isCallExpression);

						// stop if not a define node
						if (!isAMDNode) {
							return;
						}

						// get all the arguments of the define node
						const args = node.parent.arguments;

						// get array in define
						const ArrayExpression = args.find(item => item.type === "ArrayExpression");

						// get the element
						const elementIsInvalid = ArrayExpression && ArrayExpression.elements && ArrayExpression.elements.find(item => {
							if ( item && item.value ) {
								const isExclusion = excludePaths.some(toExclude => item.value.includes(toExclude));
								return !isExclusion && (forceSlash ? item.value.includes('/') : true) && !item.value.includes(pathToCheckFor);
							}
							return null;
						});

						if ( elementIsInvalid ) {
							context.report({
								node,
								message: `Looks like ${elementIsInvalid.value} should have ${pathToCheckFor} extension`
							});
						}

					}
				};
			}
		}
	}
};