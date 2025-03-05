import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import path from 'path';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit()],
	resolve: {
		alias: {
			$components: path.resolve('./src/components'),
			$lib: path.resolve('./src/lib')
		}
	}
});
