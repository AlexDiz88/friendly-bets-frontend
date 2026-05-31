import { TFunction } from 'i18next';
import Team from '../../features/admin/teams/types/Team';
import { pathToLogoImage } from './imgBase64Converter';

export function teamI18nKey(team: Pick<Team, 'title'> | undefined): string {
	return team?.title?.trim() ?? '';
}

export function resolveTeamLogoUrl(team: Pick<Team, 'title' | 'logoKey'> | undefined): string {
	return pathToLogoImage(team?.logoKey || teamI18nKey(team));
}

export function resolveTeamDisplayName(
	team: Pick<Team, 'title' | 'displayNames'> | undefined,
	t: TFunction,
	language: string
): string {
	if (!team) {
		return '';
	}
	const lang = language ?? '';
	const names = team.displayNames;
	let localizedName: string | undefined;
	if (lang.startsWith('ru')) {
		localizedName = names?.ru?.trim();
	} else if (lang.startsWith('de')) {
		localizedName = names?.de?.trim();
	} else {
		localizedName = names?.en?.trim();
	}
	if (localizedName) {
		return localizedName;
	}
	const key = teamI18nKey(team);
	if (key) {
		const translated = t(`teams:${key}`, { defaultValue: '' });
		if (translated) {
			return translated;
		}
	}
	return key;
}

/** Russian label for sorting admin team lists (displayNames.ru, then i18n, then title). */
export function resolveTeamRussianSortName(
	team: Pick<Team, 'title' | 'displayNames'> | undefined,
	t: TFunction
): string {
	if (!team) {
		return '';
	}
	const ru = team.displayNames?.ru?.trim();
	if (ru) {
		return ru;
	}
	return resolveTeamDisplayName(team, t, 'ru') || team.title;
}

/** Match team by title, display names (ru/en/de), and localized labels. */
export function teamMatchesSearchQuery(
	team: Pick<Team, 'title' | 'displayNames'> | undefined,
	query: string,
	t: TFunction
): boolean {
	if (!team) {
		return false;
	}
	const q = query.trim().toLowerCase();
	if (!q) {
		return true;
	}
	const parts = new Set<string>();
	const add = (value: string | undefined): void => {
		const s = value?.trim();
		if (s) {
			parts.add(s.toLowerCase());
		}
	};
	add(team.title);
	add(team.displayNames?.ru);
	add(team.displayNames?.en);
	add(team.displayNames?.de);
	add(resolveTeamDisplayName(team, t, 'ru'));
	add(resolveTeamDisplayName(team, t, 'en'));
	add(resolveTeamDisplayName(team, t, 'de'));
	return [...parts].some((part) => part.includes(q));
}
