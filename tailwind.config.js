/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                'pv-text-color': 'var(--text-color)',
                'pv-primary-color': 'var(--primary-color)',
                'pv-primary-color-text': 'var(--primary-color-text)'
            }
        }
    },
    plugins: [require('tailwind-scrollbar')]
}
