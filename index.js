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
						const NormalFunctionExpression = args.find(item => item.type === "FunctionExpression");
						const ArrowFunctionExpression = args.find(item => item.type === "ArrowFunctionExpression");


						if ( options['checkInFunction'] ) {

							const FunctionExpression = NormalFunctionExpression || ArrowFunctionExpression;

							if ( FunctionExpression && FunctionExpression.params.length > 0 ) {
								const FunctionParameters = FunctionExpression.params.map(item => item.name);
								params.forEach(param => {
									if ( !FunctionParameters.includes(param) ) {
										context.report({
											node,
											message: `${param} is missing in Define Function Callback`
										});
									}
								})
							}
						}


						if ( options['checkInArray'] ) {

							if ( ArrayExpression && ArrayExpression.elements.length > 0 ) {
								const ArrayParameters = ArrayExpression.elements.map(item => item.value);
								params.forEach(param => {
									if ( !ArrayParameters.includes(param) ) {
										context.report({
											node,
											message: `${param} is missing in Define Array`
										});
									}
								})
							}
						}
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
						const LiteralExpression = args.find(item => item.type === 'Literal');
						let elementIsInvalid = null;

						const isInvalid = (item) => {
							if ( item && item.value ) {
								const isExclusion = excludePaths.some(toExclude => item.value.includes(toExclude));
								return !isExclusion && (forceSlash ? item.value.includes('/') : true) && !item.value.includes(pathToCheckFor);
							}
							return null;
						}

						if ( ArrayExpression ) {
							elementIsInvalid = ArrayExpression && ArrayExpression.elements && ArrayExpression.elements.find(item => isInvalid(item));
						} else if ( LiteralExpression ) {
							elementIsInvalid = isInvalid(LiteralExpression) ? LiteralExpression : false;
						}

						// get the element
						if ( elementIsInvalid ) {
							context.report({
								node,
								message: `Looks like ${elementIsInvalid.value} should have ${pathToCheckFor} extension`
							});
							return false;
						}

					}
				};
			}
		}
	}
};