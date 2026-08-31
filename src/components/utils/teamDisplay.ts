import Team from '../../features/admin/teams/types/Team';
import { pathToLogoImage } from './imgBase64Converter';

export function teamLogoKey(team: Pick<Team, 'title' | 'logoKey'> | undefined): string {
	return team?.logoKey?.trim() || team?.title?.trim() || '';
}

export function resolveTeamLogoUrl(team: Pick<Team, 'title' | 'logoKey'> | undefined): string {
	return pathToLogoImage(teamLogoKey(team));
}

/** @deprecated use {@link teamLogoKey} */
export function teamI18nKey(team: Pick<Team, 'title'> | undefined): string {
	return teamLogoKey(team);
}

export function resolveTeamDisplayName(
	team: Pick<Team, 'title' | 'displayNames'> | undefined,
	language: string
): string {
	if (!team) {
		return '';
	}
	const names = team.displayNames;
	const lang = language ?? '';
	if (lang.startsWith('ru')) {
		return names?.ru?.trim() || names?.en?.trim() || team.title?.trim() || '';
	}
	if (lang.startsWith('de')) {
		return names?.de?.trim() || names?.en?.trim() || team.title?.trim() || '';
	}
	return names?.en?.trim() || team.title?.trim() || '';
}

/** Russian label for sorting admin team lists. */
export function resolveTeamRussianSortName(
	team: Pick<Team, 'title' | 'displayNames'> | undefined
): string {
	if (!team) {
		return '';
	}
	return team.displayNames?.ru?.trim() || team.displayNames?.en?.trim() || team.title?.trim() || '';
}

/** Match team by title and display names (ru/en/de). */
export function teamMatchesSearchQuery(
	team: Pick<Team, 'title' | 'displayNames'> | undefined,
	query: string
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
	return [...parts].some((part) => part.includes(q));
}
