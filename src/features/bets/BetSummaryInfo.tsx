import { Avatar, Box, Container, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import MatchDayTitleTransform from '../../components/utils/MatchDayTitleTransform';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import Team from '../admin/teams/types/Team';
import SimpleUser from '../auth/types/SimpleUser';
import MatchDayInfo from './types/MatchDayInfo';

export default function BetSummaryInfo({
	message,
	player,
	leagueCode,
	matchDayInfo,
	homeTeam,
	awayTeam,
	isNot,
	betTitle,
	betOdds,
	betSize,
	betStatus,
	gameResult,
}: {
	message: string;
	player: SimpleUser | undefined;
	leagueCode: string;
	matchDayInfo: MatchDayInfo;
	homeTeam: Team | undefined;
	awayTeam: Team | undefined;
	betTitle: string;
	isNot: boolean;
	betOdds: string;
	betSize: string;
	gameResult: string;
	betStatus: string;
}): JSX.Element {
	const [matchDayTitle] = useState<string>(MatchDayTitleTransform(matchDayInfo));

	return (
		<Container sx={{ minWidth: '15rem', m: 0, p: 0 }}>
			<Typography component="span" sx={{ textAlign: 'center', borderBottom: 1, pb: 0.3 }}>
				<b>{message}</b>
				<br />
			</Typography>
			<Typography component="span" sx={{ fontSize: '0.9rem' }}>
				<b>{t('player')}:</b> {player?.username} <br />
				<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
					<b>{t('league')}:</b>
					<Avatar
						component="span"
						variant="square"
						sx={{ px: 0.5, height: 27, width: 'auto' }}
						alt="league_logo"
						src={pathToLogoImage(leagueCode)}
					/>
					{t(`leagueFullName.${leagueCode}`)} <br />
				</Box>
				<b>{t('matchday')}:</b> {matchDayTitle}
				<br />
				<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
					<b>{t('homeTeam')}:</b>
					<Avatar
						component="span"
						variant="square"
						sx={{ px: 0.5, height: 27, width: 'auto' }}
						alt="league_logo"
						src={pathToLogoImage(homeTeam?.title)}
					/>
					{homeTeam?.title} <br />
				</Box>
				<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
					<b>{t('awayTeam')}:</b>
					<Avatar
						component="span"
						variant="square"
						sx={{ px: 0.5, height: 27, width: 'auto' }}
						alt="league_logo"
						src={pathToLogoImage(awayTeam?.title)}
					/>
					{awayTeam?.title} <br />
				</Box>
				<b>{t('bet')}:</b> {betTitle}
				{isNot ? t('not') : ''} <br />
				<b>{t('coef')}:</b> {betOdds} <br />
				<b>{t('amount')}:</b> {betSize} <br />
				{betStatus && betStatus !== 'OPENED' && (
					<>
						<b>{t('betStatus')}:</b> {betStatus}
						<br />
						<b>{t('finalScore')}: </b>
						<Typography
							component="span"
							sx={{
								color:
									gameResult === t('incorrectGameScore') || gameResult === '' ? 'brown' : 'inherit',
								fontWeight: gameResult === t('incorrectGameScore') || gameResult === '' ? 600 : 400,
							}}
						>
							{gameResult || t('notSpecified')}
						</Typography>
					</>
				)}
			</Typography>
		</Container>
	);
}
