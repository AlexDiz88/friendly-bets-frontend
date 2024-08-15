import { Box } from '@mui/material';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import TeamAvatar from '../../components/custom/avatar/TeamAvatar';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import BetSummary from './types/BetSummary';

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
}: BetSummary): JSX.Element {
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
				<LeagueAvatar leagueCode={leagueCode} fullName sx={{ ml: 0.5 }} />
			</Box>
			<b>{t('matchday')}:</b> {transformedTitle}
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<b>{t('homeTeam')}:</b>
				<TeamAvatar team={homeTeam} />
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<b>{t('awayTeam')}:</b>
				<TeamAvatar team={awayTeam} />
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
