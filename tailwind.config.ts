import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			screens: {
				wide: '1440px'
			}
		}
	},

	plugins: []
} satisfies Config;
