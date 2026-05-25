import Team from '../admin/teams/types/Team';
import { teamNameMap } from './gameResults/teamMap';
import { ExternalMatch } from './types/ExternalMatch';

/** Команда для отображения на странице результатов (логотип + i18n по title). */
export function matchSideToDisplayTeam(match: ExternalMatch, side: 'home' | 'away'): Team {
	const apiName = side === 'home' ? match.homeTeamName : match.awayTeamName;
	const resolvedTitle =
		side === 'home' ? match.homeTeamTitle : match.awayTeamTitle;
	const title =
		(resolvedTitle && resolvedTitle.trim()) ||
		teamNameMap[apiName] ||
		apiName;
	const logoKey = side === 'home' ? match.homeTeamLogoKey : match.awayTeamLogoKey;
	const displayNames =
		side === 'home' ? match.homeTeamDisplayNames : match.awayTeamDisplayNames;
	return {
		id: side === 'home' ? match.homeTeamId ?? `ext-${title}` : match.awayTeamId ?? `ext-${title}`,
		title,
		logoKey: logoKey ?? undefined,
		displayNames: displayNames ?? undefined,
	};
}
