/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				swatch: {
					'primary': '#e63946',
					'primary-focus': '#cc3340',
					'primary-content': '#f1faee',
					'secondary': '#86cbf0',
					// "accent": "#457b9d",
					'accent': '#0d1117',
					'accent-content': '#f1faee',
					'neutral': '#f1faee',
					'base-100': '#ffffff',
					'--rounded-box': '0.25rem',
					'--rounded-btn': '0.25rem',
					'--btn-text-case': 'lowercase'
				}
			}
		]
	}
};
