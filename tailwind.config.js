/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"BuckeyeSans"', 'HelveticaNeue', 'Helvetica', 'Arial', 'sans-serif'],
				serif: ['"BuckeyeSerif"', 'Georgia', 'serif']
			},
			colors: {
				scarlet: '#ba0c2f'
			},
			typography: (theme) => ({
				gray: {
					css: {
						'--tw-prose-body': theme('colors.gray[400]'),
						'--tw-prose-headings': theme('colors.white'),
						'--tw-prose-links': theme('colors.scarlet')
					}
				}
			})
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
