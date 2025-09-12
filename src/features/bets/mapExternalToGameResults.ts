import { ExternalMatchdayData } from './types/ExternalMatchData';
import GameResult from './types/GameResult';
import GameScore from './types/GameScore';

interface TeamMapping {
	[externalId: number]: string; // внешний ID -> внутренний ID команды
}

interface LeagueMapping {
	[externalCode: string]: string; // внешний код лиги -> внутренний ID лиги
}

export const mapExternalToGameResults = (
	externalData: ExternalMatchdayData,
	teamMapping: TeamMapping,
	leagueMapping: LeagueMapping
): GameResult[] => {
	return externalData.matches
		.filter((match) => match.status === 'FINISHED')
		.map((match) => {
			const leagueId = leagueMapping[match.competition.code];
			const homeTeamId = teamMapping[match.homeTeam.id];
			const awayTeamId = teamMapping[match.awayTeam.id];

			if (!leagueId || !homeTeamId || !awayTeamId) {
				console.warn('Не найден маппинг для матча', match.id);
				return null;
			}

			const gameScore: GameScore = {
				fullTime: `${match.score.fullTime.home}:${match.score.fullTime.away}`,
				firstTime: `${match.score.halfTime.home}:${match.score.halfTime.away}`,
				overTime: match.score.overTime
					? `${match.score.overTime.home}:${match.score.overTime.away}`
					: null,
				penalty: match.score.penalty
					? `${match.score.penalty.home}:${match.score.penalty.away}`
					: null,
			};

			return {
				leagueId,
				homeTeamId,
				awayTeamId,
				gameScore,
			};
		})
		.filter((x): x is GameResult => x !== null);
};
