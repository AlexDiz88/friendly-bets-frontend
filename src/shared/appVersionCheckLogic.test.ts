import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	clearReloadAttempt,
	parseBuildId,
	pickNewestBuildId,
	reloadForBuildId,
	resolveVersionCheckOutcome,
	shouldRegisterLocal,
	shouldReload,
	staticVersionUrl,
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

	it('pickNewestBuildId chooses the highest numeric build id', () => {
		expect(pickNewestBuildId('100', '250', '200')).toBe('250');
		expect(pickNewestBuildId(null, undefined, '120')).toBe('120');
	});

	it('shouldReload only when remote is newer', () => {
		expect(shouldReload('100', '200')).toBe(true);
		expect(shouldReload('200', '100')).toBe(false);
		expect(shouldReload('200', '200')).toBe(false);
	});

	it('shouldRegisterLocal when local is newer or remote missing', () => {
		expect(shouldRegisterLocal('300', '200')).toBe(true);
		expect(shouldRegisterLocal('100', '200')).toBe(false);
		expect(shouldRegisterLocal('100', null)).toBe(true);
	});

	it('resolveVersionCheckOutcome reloads old tab when static version is newer', () => {
		const outcome = resolveVersionCheckOutcome('100', '300', '200', null);
		expect(outcome).toEqual({ type: 'reload', remoteBuildId: '300' });
	});

	it('resolveVersionCheckOutcome registers when no remote version exists', () => {
		const outcome = resolveVersionCheckOutcome('100', null, null, null);
		expect(outcome).toEqual({ type: 'register', buildId: '100' });
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

	it('staticVersionUrl always points to site root version.json', () => {
		vi.stubGlobal('window', {
			location: { origin: 'https://friendly-bets.net' },
		});
		expect(staticVersionUrl()).toBe('https://friendly-bets.net/version.json');
	});
});
