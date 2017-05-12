
const jsRules = {
  "deprecation": true,
};


const rules = {
  ...jsRules,


  // warn about type assertions that don't change the type
  "no-unnecessary-type-assertion": true,


  // require that functions returning `Promise` be declared `async`
  "promise-function-async": true,

  // warn when `await`-ing a value that is not a `Promise`
  "await-promise": true,

  // warn when a function returns a promise that is ignored
  "no-floating-promises": true,

  // warn when `any` values are used except as `mixed`
  "no-unsafe-any": true,

  // warn when expressions that return void are not used as statements
  "no-void-expression": true,

  // warn when using two different types with the plus operator
  "restrict-plus-operands": true,

  // warn on type predicates that are always true or always false
  "strict-type-predicates": true,
};