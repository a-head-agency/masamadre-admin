/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    rules: {
        'vue/component-tags-order': [
            'error',
            {
                order: ['script', 'template', 'style']
            }
        ]
    },
    parserOptions: {
        ecmaVersion: 'latest'
    },
    plugins: ['unused-imports']
}
