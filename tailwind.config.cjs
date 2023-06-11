/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			transitionProperty: {
				width: 'width'
			},
			animation: {
				fade: 'fadeIn 150ms linear'
			},
			keyframes: {
				fadeIn: {
					'0%': {opacity: 0},
					'100%': {opacity: 1}
				}
			},
			fontFamily: {
				sans: ['Overpass', 'sans-serif'],
				mono: ['DM Mono', 'monospace']
			},
			boxShadow: {
				reg: '2px 2px 3px slategray'
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				swatch: {
					'primary': '#e63946',
					'primary-focus': '#cc3340',
					'primary-content': '#f1faee',
					'secondary': '#008aff',
					// "accent": "#457b9d",
					'accent': '#0d1117',
					'accent-content': '#f1faee',
					// 'neutral': '#f1faee',
					'base-100': '#ffffff',
					'--rounded-box': '0.25rem',
					'--rounded-btn': '0.25rem',
					'--btn-text-case': 'lowercase'
				},
				v2: {
					'primary': '#1E1452',
					'secondary': '#1a322c',
					'secondary-content': 'white',
					'accent': '#451D78',
					'base-100': '#1a202c',
					'base-200': '#444',
					'base-content': 'white',
					'--rounded-box': '0.25rem',
					'--rounded-btn': '0.125rem',
					'--btn-text-case': 'lowercase'
				},
				dark: {
					'primary': '#2e2e2e',
					'secondary': '#ff4700',
					'accent': '#4c97c9',
					'base-100': '#1a1a1a',
					'base-200': '#0e0e0e',
					'success': '#177d36',
					'--rounded-box': '0.25rem',
					'--rounded-btn': '0.125rem',
					'--btn-text-case': 'lowercase'

				}
			}
		]
	}
};
