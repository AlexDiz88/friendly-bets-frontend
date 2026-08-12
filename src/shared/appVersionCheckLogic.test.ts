import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	clearReloadAttempt,
	parseBuildId,
	reloadForBuildId,
	shouldReload,
} from './appVersionCheckLogic';

describe('appVersionCheckLogic', () => {
	afterEach(() => {
		sessionStorage.clear();
		vi.restoreAllMocks();
	});

	it('parseBuildId supports decimal and legacy base36 ids', () => {
		expect(parseBuildId('1750000000000')).toBe(1750000000000);
		expect(parseBuildId('lkz8f0')).toBe(parseInt('lkz8f0', 36));
		expect(parseBuildId('not-a-version')).toBeNull();
	});

	it('shouldReload only when remote is newer', () => {
		expect(shouldReload('100', '200')).toBe(true);
		expect(shouldReload('200', '100')).toBe(false);
		expect(shouldReload('200', '200')).toBe(false);
		expect(shouldReload('200', null)).toBe(false);
	});

	it('reloadForBuildId retries with cache-busting query on second attempt', () => {
		const replace = vi.fn();
		const reload = vi.fn();
		vi.stubGlobal('location', {
			href: 'https://example.com/app/',
			reload,
			replace,
		});

		reloadForBuildId('300', '100');
		expect(sessionStorage.getItem('appReloadAttempt:100')).toBe('300');
		expect(reload).toHaveBeenCalledTimes(1);

		reloadForBuildId('300', '100');
		expect(replace).toHaveBeenCalledWith('https://example.com/app/?_v=300');
	});

	it('clearReloadAttempt removes reload marker for local build', () => {
		sessionStorage.setItem('appReloadAttempt:100', '300');
		clearReloadAttempt('100');
		expect(sessionStorage.getItem('appReloadAttempt:100')).toBeNull();
	});
});
