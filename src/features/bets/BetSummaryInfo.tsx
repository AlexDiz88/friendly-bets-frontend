import { Avatar, Box, Typography } from '@mui/material';
import User from '../auth/types/User';
import Team from '../admin/teams/types/Team';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import MatchDayInfo from './types/MatchDayInfo';
import { useState } from 'react';
import MatchDayTitleTransform from '../../components/utils/MatchDayTitleTransform';
import { t } from 'i18next';

export default function BetSummaryInfo({
	message,
	player,
	leagueShortNameEn,
	leagueDisplayNameRu,
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
	player: User | undefined;
	leagueShortNameEn: string;
	leagueDisplayNameRu: string;
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
		<>
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
						src={pathToLogoImage(leagueShortNameEn)}
					/>
					{leagueDisplayNameRu} <br />
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
						src={pathToLogoImage(homeTeam?.fullTitleEn)}
					/>
					{homeTeam?.fullTitleRu} <br />
				</Box>
				<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
					<b>{t('awayTeam')}:</b>
					<Avatar
						component="span"
						variant="square"
						sx={{ px: 0.5, height: 27, width: 'auto' }}
						alt="league_logo"
						src={pathToLogoImage(awayTeam?.fullTitleEn)}
					/>
					{awayTeam?.fullTitleRu} <br />
				</Box>
				<b>{t('bet')}:</b> {betTitle}
				{isNot ? ' - нет' : ''} <br />
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
									gameResult === 'Некорректный счёт матча!' || gameResult === ''
										? 'brown'
										: 'inherit',
								fontWeight:
									gameResult === 'Некорректный счёт матча!' || gameResult === '' ? 600 : 400,
							}}
						>
							{gameResult || 'Не указан!'}
						</Typography>
					</>
				)}
			</Typography>
		</>
	);
}
