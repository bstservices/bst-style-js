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

export const jsRules = {
  // prevent use of arrow functions for binding
  "no-unnecessary-callback-wrapper": true,

  // require that all control-flow statements use a block
  // unless the single statement is on the same line as the control statement
  "curly": [true, "ignore-same-line"],

  // require that `for ... in` statements be qualified with a condition
  "forin": true,

  // prohibit use of `arguments.callee`
  // this is mandatory to prevent horrible performance issues
  "no-arg": true,

  // prevent usage of bitwise operators
  // they're not common in JS and are usually typos
  "no-bitwise": true,

  // prevent use of assignments within conditionals
  // they're usually typos and should be considered carefully when intentional
  "no-conditional-assignment": true,

  // disable all calls to the console
  // it shouldn't be used in prod code
  "no-console": true,

  // prohibit `debugger` statements
  // they shouldn't be kept in production code
  "no-debugger": true,

  // don't allow primitive type constructors
  // you almost always want the converter (no `new`) instead
  "no-construct": true,

  // warn about multiple calls to `super` in the same constructor
  // calls after the first will fail at runtime
  "no-duplicate-super": true,

  // prohibit empty blocks
  // if you need one, put a comment in it
  "no-empty": true,

  // prohibit use of `eval()`
  // `eval` is never the right way to do anything. ever.
  "no-eval": true,

  // warn on template substitutions (`${...}`) in non-template strings
  "no-invalid-template-strings": true,

  // disallow use of `this` outside class methods
  "no-invalid-this": true,

  // prohibit shadowing of variables
  // shadowing causes confusion when you don't see the inner redeclaration
  "no-shadowed-variable": true,

  // warn on missing elements in arrays
  // they're usually unintentionally duplicated commas
  // if you want a missing element pass `undefined` explicitly
  "no-sparse-arrays": true,

  // warn on access to object properties with string literal keys
  // using `["foo"]` instead of `.foo` makes type checking less effective
  "no-string-literal": true,

  // prohibit throwing strings
  // only `Error` objects produce stack traces
  "no-string-throw": true,

  // warn on switch cases that fall through
  // they're almost always an accidental omission of the `break` statement
  // if you want fall through, end the case with `/* falls through */`
  "no-switch-case-fall-through": true,

  // prohibit jumping statements in `finally` blocks
  // their behavior is confusing
  "no-unsafe-finally": true,

  // warn on expression statements that return a value
  // these are usually mistakes
  "no-unused-expression": true,

  // prohibit `var` declarations
  // use `let` or `const` instead
  "no-var-keyword": true,

  // make the `radix` parameter to `parseInt` required
  // behavior when it isn't provided is implementation-defined
  "radix": true,

  // require use of triple-equals instead of double-equals
  // except for `foo == null` to check for `null` and `undefined` together
  "triple-equals": [true, "allow-null-check"],

  // warn when `typeof` is compared to a string it can't return
  "typeof-compare": true,

  // warn that `isNaN()` should be used on comparisons with `NaN`
  // `NaN` is never equal to anything and lots of people don't know that
  "use-isnan": true,
};

export const rules = {
  ...jsRules,


  "ban-types": {
    options: [
      ["Object", "Avoid using the `Object` type. Did you mean `object`?"],
      ["Function", "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."],
      ["Boolean", "Avoid using the `Boolean` type. Did you mean `boolean`?"],
      ["Number", "Avoid using the `Number` type. Did you mean `number`?"],
      ["String", "Avoid using the `String` type. Did you mean `string`?"],
      ["Symbol", "Avoid using the `Symbol` type. Did you mean `symbol`?"],
    ],
  },

  // warn on attempts to declare construct signatures on interfaces
  // or to declare a method called `new` on classes
  "no-misused-new": true,


  // prohibit type assertions applied directly to an object literal
  // use a variable of the right type, which enables checking the object
  "no-object-literal-type-assertion": true,
};
