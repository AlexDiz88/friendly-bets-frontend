import { Avatar, Box, Card, Typography } from '@mui/material';
import { t } from 'i18next';
import { FC } from 'react';
import { getGameScoreView } from '../../../components/utils/gameScoreValidation';
import { pathToLogoImage } from '../../../components/utils/imgBase64Converter';
import Team from '../../admin/teams/types/Team';
import GameScore from '../../bets/types/GameScore';
import { fakeMatchesData2 } from './fakeMatchesData2';
import { teamNameMap } from './teamMap';

export interface Match {
	id: number;
	utcDate: string;
	status: string;
	homeTeam: { name: string };
	awayTeam: { name: string };
	score: {
		fullTime: { home: number | null; away: number | null };
		halfTime: { home: number | null; away: number | null };
		overtime?: { home: number | null; away: number | null };
		penalty?: { home: number | null; away: number | null };
	};
}

const GameList: FC = () => {
	const matches: Match[] = fakeMatchesData2.matches;

	// Подготовка всех данных заранее
	const preparedMatches = matches.map((match) => {
		const date = new Date(match.utcDate).toLocaleString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});

		const homeTeamTitle = teamNameMap[match.homeTeam.name] ?? match.homeTeam.name;
		const awayTeamTitle = teamNameMap[match.awayTeam.name] ?? match.awayTeam.name;

		const homeTeam: Team = { id: `id-${homeTeamTitle}`, title: homeTeamTitle };
		const awayTeam: Team = { id: `id-${awayTeamTitle}`, title: awayTeamTitle };

		const gameScore: GameScore = {
			fullTime:
				match.score.fullTime.home !== null && match.score.fullTime.away !== null
					? `${match.score.fullTime.home}:${match.score.fullTime.away}`
					: null,
			firstTime:
				match.score.halfTime.home !== null && match.score.halfTime.away !== null
					? `${match.score.halfTime.home}:${match.score.halfTime.away}`
					: null,
			overTime:
				match.score.overtime &&
				match.score.overtime.home !== null &&
				match.score.overtime.away !== null
					? `${match.score.overtime.home}:${match.score.overtime.away}`
					: null,
			penalty:
				match.score.penalty &&
				match.score.penalty.home !== null &&
				match.score.penalty.away !== null
					? `${match.score.penalty.home}:${match.score.penalty.away}`
					: null,
		};

		const gameScoreView = getGameScoreView(gameScore);

		return { match, date, homeTeam, awayTeam, gameScoreView };
	});

	return (
		<Box display="flex" flexDirection="column" gap={1}>
			{preparedMatches.map(({ match, date, homeTeam, awayTeam, gameScoreView }) => (
				<Card
					key={match.id}
					variant="outlined"
					sx={{
						p: 0,
						boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
						minWidth: 350,
						maxWidth: 550,
						mx: 'auto',
						border: 1,
						borderRadius: 1,
					}}
				>
					<Box sx={{ p: 0.5 }}>
						<Box display="flex" justifyContent="space-between" mb={0}>
							<Typography fontWeight={600} variant="caption">
								{date}
							</Typography>
							<Typography
								fontWeight={600}
								variant="caption"
								color={match.status === 'FINISHED' ? 'success.main' : 'warning.main'}
							>
								{match.status}
							</Typography>
						</Box>

						<Box
							sx={{
								fontSize: '0.9rem',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							{/* Home Team */}
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									flex: '0 0 40%',
									justifyContent: 'flex-end',
									pr: 1,
									textAlign: 'center',
								}}
							>
								{t(`teams:${homeTeam?.title || ''}`)}
								<Avatar
									sx={{ ml: 0.3, height: 25, width: 25 }}
									variant="square"
									alt="team_logo"
									src={pathToLogoImage(homeTeam?.title)}
								/>
							</Box>

							{/* Score */}
							<Box
								sx={{
									flex: '0 0 20%',
									textAlign: 'center',
									fontSize: '1rem',
									fontWeight: 600,
								}}
							>
								{gameScoreView}
							</Box>

							{/* Away Team */}
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									flex: '0 0 40%',
									justifyContent: 'flex-start',
									pl: 1,
									textAlign: 'center',
								}}
							>
								<Avatar
									sx={{ mr: 0.3, height: 25, width: 25 }}
									variant="square"
									alt="team_logo"
									src={pathToLogoImage(awayTeam?.title)}
								/>
								{t(`teams:${awayTeam?.title || ''}`)}
							</Box>
						</Box>
					</Box>
				</Card>
			))}
		</Box>
	);
};

export default GameList;
