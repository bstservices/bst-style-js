/* Copyright 2017 BST Event Services, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* This ruleset asserts those parts of the coding standard that make a style
 * decision among two or more semantically equivalent choices, e.g. rules for
 * the placement of whitespace and braces.
 */

export const rulesDirectory = "./rules";

export const jsRules = {
  "indent": [true, "spaces", 2],
  "linebreak-style": [true, "LF"],
  "eofline": true,
  "max-line-length": {options: [120]},
  "no-trailing-whitespace": true,
  "encoding": true, // require UTF-8

  "no-unicode": {options: {
    "comment": "always",
    "identifier": "never",
    "string": "always",
    "template": "always",
  }},

  "comment-format": [true, "check-space"],
  "jsdoc-format": true,

  "quotemark": [
    true,
    "double",
    "jsx-double",
    "avoid-escape",
    "avoid-template",
  ],

  "semicolon": [true, "always"],

  "trailing-comma": {options: {
    "multiline": "always",
    "singleline": "never",
    "esSpecCompliant": true,
  }},

  // =========================
  // Order of Things in a File

  "member-ordering": {options: {
    "order": [
      "static-field",
      "static-method",
      "instance-field",
      "constructor",
      "instance-method",
    ],
  }},

  "ordered-imports": {options: {
    "import-sources-order": "case-insensitive",
    "named-imports-order": "lowercase-last",
  }},


  // =======================
  // Placement of Whitespace

  "whitespace": {options: [
    "check-branch",
    "check-decl",
    "check-operator",
    // "check-module" is handled by "import-spacing"
    "check-separator",
    // "check-type" is handled by "typedef-whitespace"
    // "check-typecast" is made irrelevant by "no-angle-bracket-type-assertion"
    "check-preblock",
  ]},

  "space-within-parens": 0,

  "import-spacing": true,

  "space-before-function-paren": {options: {
    "anonymous": "always",
    "asyncArrow": "always",
    "constructor": "never",
    "method": "never",
    "named": "never",
  }},

  // members of multi-line lists of things must all start in the same column
  "align": {options: [
    "parameters",
    "arguments",
    "elements",
    "members",
    "statements",
  ]},

  // check-open-brace must be disabled as it does not distinguish between
  // control structures (where we require brace on same line) and class-like
  // structures (where we require brace on next line)
  // whitespace before opening brace on same line is checked by "whitespace"
  "one-line": {options: [
    "check-catch",
    "check-else",
    "check-finally",
    "check-whitespace",
  ]},


  // ====================
  // Function-like Things

  "arrow-parens": true,
  "arrow-return-shorthand": true,

  // require anonymous functions to use the arrow syntax
  "only-arrow-functions": [true, "allow-declarations"],

  "new-parens": true,

  // prefer `foo(): void` over `foo: () => void` in interfaces and types
  "prefer-method-signature": true,

  // force use of arrow lambdas to bind `this`
  // intstead of assigning `this` to a variable in closure scope
  "no-this-assignment": true,


  // =============
  // Naming Things

  // enforce that class names are PascalCase
  "class-name": true,

  // enforce that variable names are camelCase or ANGRY_SNAKE_CASE
  // also prohibits variable names starting or ending with an underscore
  "variable-name": [
    true,
    "check-format",
    "ban-keywords",
    "allow-pascal-case",
  ],


  // prefer `let foo;` over `let foo = undefined;`
  "no-unnecessary-initializer": true,

  // prefer `0.1` over `.1`
  "number-literal-format": true,



  // never quote object literal keys unless the key requires it
  "object-literal-key-quotes": [true, "needed"],

  // prefer `{ foo }` over `{ foo: foo }`
  "object-literal-shorthand": true,

  // use `{... object}` instead of `Object.assign({}, object)`
  // this allows for better type checking
  "prefer-object-spread": true,


  // prefer `let foo; let bar;` to `let foo, bar;`
  "one-variable-per-declaration": [true, "ignore-for-loop"],

  // prefer template literals over string concatenation
  "prefer-template": [true, "allow-single-concat"],


  // prefer ES2015 `import 'foo'` over `require('foo')`
  "no-require-imports": true,

  "prefer-const": true,


  // prefer `for ... of` over `for ... in` when iterating arrays
  "prefer-for-of": true,

  "prefer-while": true,


  // prevent labels on statements that don't work with `break`
  "label-position": true,


  // require all imports from a given module to be made in one statement
  "no-duplicate-imports": true,

  // require all imports to be made by name
  "no-default-import": true,
};

export const rules = {
  ...jsRules,

  // require overloads of a method to be adjacent in the file
  // this is important as their order matters
  "adjacent-overload-signatures": true,

  // require that the minimal set of overloads is declared
  "unified-signatures": true,

  "typedef-whitespace": {options: [
    { // left of the colon
      "call-signature": "nospace",
      "index-signature": "nospace",
      "parameter": "nospace",
      "property-declaration": "nospace",
      "variable-declaration": "nospace",
    },
    { // right of the colon
      "call-signature": "onespace",
      "index-signature": "onespace",
      "parameter": "onespace",
      "property-declaration": "onespace",
      "variable-declaration": "onespace",
    },
  ]},


  // prefer Array<T> over T[] when used with other generics,
  // but prefer T[] when it's the only type being specified
  "array-type": [true, "array-simple"],

  // prefer function types over callable object types with no other members
  "callable-types": true,

  // enforce that interface names do not have an I prefix
  "interface-name": [true, "never-prefix"],

  // prefer (variable as Type) over (<Type> variable)
  "no-angle-bracket-type-assertion": true,

  "no-empty-interface": true,



  // generally prohibit imports used for side effects
  // however, allow certain Webpack loader-based imports
  "no-import-side-effect": [true, {"ignore-module": "(\\.s?css)$"}],

  // require ES2015 imports instead of triple-slash comments
  "no-reference": true,


  // enforce that members are never declared `public`
  "member-access": [true, "no-public"],

  "interface-over-type-literal": true,


  // prefer ES6 modules over declaration of multiple namespaces per file
  "no-namespace": [true, "allow-declarations"],

  // require use of `namespace` instead of `module`
  "no-internal-module": true,

  // don't put two blocks for the same namespace in one file
  "no-mergeable-namespace": true,
};
