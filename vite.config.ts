import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	if (mode === 'development') {
		return {
			plugins: [react()],
			server: {
				open: true,
				proxy: {
					'/api': {
						target: 'http://localhost:8080',
					},
				},
			},
			build: {
				outDir: 'build',
				sourcemap: true,
			},
			test: {
				globals: true,
				environment: 'jsdom',
				setupFiles: 'src/setupTests',
				mockReset: true,
			},
		};
	}

	const buildId = process.env.VITE_APP_BUILD_ID ?? Date.now().toString();

	return {
		plugins: [react()],
		define: {
			'import.meta.env.VITE_APP_BUILD_ID': JSON.stringify(buildId),
		},
		server: {
			open: true,
			proxy: {
				'/api': {
					target: '/',
				},
			},
		},
		build: {
			outDir: 'build',
			sourcemap: true,
		},
		base: './',
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: 'src/setupTests',
			mockReset: true,
		},
	};
});
