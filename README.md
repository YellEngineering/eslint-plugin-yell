# YELL Custom ESLint Rules

These are Yell's Custom ESLint rules used throughout engineering.



---
## Define Babel ES6

Rule Name: **defineBabelES6**

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