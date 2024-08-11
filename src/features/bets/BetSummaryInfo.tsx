import { Avatar, Box } from '@mui/material';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import Team from '../admin/teams/types/Team';
import SimpleUser from '../auth/types/SimpleUser';

export default function BetSummaryInfo({
	message,
	player,
	leagueCode,
	matchDay,
	homeTeam,
	awayTeam,
	isNot,
	betTitle,
	betOdds,
	betSize,
	betStatus = '',
	gameResult = '',
}: {
	message: string;
	player: SimpleUser | undefined;
	leagueCode: string;
	matchDay: string;
	homeTeam: Team | undefined;
	awayTeam: Team | undefined;
	betTitle: string;
	isNot: boolean;
	betOdds: string;
	betSize: string;
	gameResult?: string;
	betStatus?: string;
}): JSX.Element {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;
	const transformedTitle = matchDayTitleViewTransform(matchDay, currentLanguage);

	return (
		<Box sx={{ minWidth: '15rem', m: 0, p: 0, fontWeight: 400 }}>
			<Box sx={{ textAlign: 'left', borderBottom: 1, pb: 0.3, mb: 1.5 }}>
				<b>{message}</b>
			</Box>
			<b>{t('player')}:</b> {player?.username}
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<b>{t('league')}:</b>
				<Avatar
					variant="square"
					sx={{ px: 0.5, height: 27, width: 'auto' }}
					alt="league_logo"
					src={pathToLogoImage(leagueCode)}
				/>
				{t(`leagueFullName.${leagueCode}`)}
			</Box>
			<b>{t('matchday')}:</b> {transformedTitle}
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<b>{t('homeTeam')}:</b>
				<Avatar
					variant="square"
					sx={{ px: 0.5, height: 27, width: 'auto' }}
					alt="league_logo"
					src={pathToLogoImage(homeTeam?.title)}
				/>
				{t(`teams:${homeTeam?.title || ''}`)}
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<b>{t('awayTeam')}:</b>
				<Avatar
					variant="square"
					sx={{ px: 0.5, height: 27, width: 'auto' }}
					alt="league_logo"
					src={pathToLogoImage(awayTeam?.title)}
				/>
				{t(`teams:${awayTeam?.title || ''}`)}
			</Box>
			<b>{t('bet')}:</b> {betTitle} {isNot ? t('not') : ''} <br />
			<b>{t('coef')}:</b> {betOdds} <br />
			<b>{t('amount')}:</b> {betSize} <br />
			{betStatus && betStatus !== 'OPENED' && (
				<Box>
					<b>{t('betStatus')}:</b> {betStatus}
					<br />
					<b>{t('finalScore')}: </b>
					<Box
						sx={{
							color:
								gameResult === t('incorrectGameScore') || gameResult === '' ? 'brown' : 'inherit',
							fontWeight: gameResult === t('incorrectGameScore') || gameResult === '' ? 600 : 400,
						}}
					>
						{gameResult || t('notSpecified')}
					</Box>
				</Box>
			)}
		</Box>
	);
}
