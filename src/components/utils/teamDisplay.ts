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
	if (names) {
		if (lang.startsWith('ru') && names.ru) {
			return names.ru;
		}
		if (lang.startsWith('de') && names.de) {
			return names.de;
		}
		if (names.en) {
			return names.en;
		}
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
