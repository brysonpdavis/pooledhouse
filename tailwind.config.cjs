/** @type {import('tailwindcss').Config} */
module.exports = {
	future: {
		hoverOnlyWhenSupported: true
	},
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				fade: 'fadeIn 150ms linear'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 }
				}
			},
			fontFamily: {
				sans: ['Overpass', 'sans-serif'],
				mono: ['DM Mono', 'monospace']
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
