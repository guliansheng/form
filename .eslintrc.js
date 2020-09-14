module.exports = {
  root: true,
  env: {
    node: false
  },
  // extends: ['@pillarjs/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['off'],
    'no-trailing-spaces': 'off',
    'space-before-function-paren': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}