module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	rules: {
		'prettier/prettier': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-var': 'error',
		'prefer-const': 'warn',
		'quotes': ['warn', 'single', { avoidEscape: true }],
		'semi': ['warn', 'always'],
	},
};
