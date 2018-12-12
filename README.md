# YELL Custom ESLint Rules

These are Yell's Custom ESLint rules used throughout engineering.



---
## AMD Force Parameter

Rule Name: **amdForceParameter**
- Custom YELL plugin to enforce paramaters in define Array and Function callback

### Usage
```js
/**
 * @param files: {Array} : Extensions of files to process
 * @param params: { Array } : Parameters to look for in Array and Function
 * @param checkInArray: { Boolean } Check in Array?
 * @param checkInFunction: { Boolean } Check in Function?
 */
"yell/amdForceParameter": [2, {
	files: ['.es6'],
	params: ['babelHelpers'],
	checkInArray: true,
	checkInFunction: true
}],

```

```
// VALID!
define(['babelHelpers'], function(babelHelpers) {})

define(['$', 'babelHelpers'], function($, babelHelpers) {})

define(['$', 'babelHelpers'], ($, babelHelpers) => {})
```

```
// INVALID!
define([], function() { })

define(function() { })

define(['$'], function($) { })
```

---

## AMD Path Checker

Rule Name: **amdPathChecker**
- Custom YELL plugin which checks for particular substring in paths

```js
/**
 * @param checkFor: { String } check for specific substring in parameters
 * @param forceSlashInPath: { Boolean } Also checks paramter for '/'
 * @param excludePaths: { Array } Exclude specific substrings
 */
"yell/amdPathChecker": [2, {
	checkFor: '.es6',
	forceSlashInPath: true,
	excludePaths: ['babelHelpers', 'libs/', 'stubs/', 'tests/', '.css', '.html', '.vue', '.js'],
}]
```