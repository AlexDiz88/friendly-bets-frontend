import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

function appVersionPlugin(buildId: string, outDir: string): Plugin {
	return {
		name: 'app-version',
		closeBundle() {
			const filePath = resolve(rootDir, outDir, 'version.json');
			writeFileSync(filePath, JSON.stringify({ buildId }, null, 0));
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
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
	} else {
		const buildId = Date.now().toString(36);
		const outDir = 'build';

		// command === 'build'
		return {
			plugins: [react(), appVersionPlugin(buildId, outDir)],
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
				outDir,
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
	}
});
