import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import TeamsAvatars from '../../components/custom/avatar/TeamsAvatars';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import Bet from './types/Bet';

export default function OpenedBetCard({ bet }: { bet: Bet }): JSX.Element {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;
	const [matchDayTitle, setMatchDayTitle] = useState<string>('');

	useEffect(() => {
		setMatchDayTitle(matchDayTitleViewTransform(bet.matchDay, currentLanguage));
	}, [bet, currentLanguage]);

	const { leagueCode, player, homeTeam, awayTeam, betTitle, betOdds, betSize } = bet;

	return (
		<>
			{bet && (
				<Box
					sx={{
						maxWidth: '25rem',
						minWidth: '19rem',
						border: 2,
						mx: 0.5,
						my: 0.5,
						p: 0.5,
						borderRadius: 2,
						bgcolor: 'white',
						boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
						}}
					>
						<UserAvatar player={player} />
						<LeagueAvatar leagueCode={leagueCode} matchDay={matchDayTitle} />
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'start' }}>
						<TeamsAvatars homeTeam={homeTeam} awayTeam={awayTeam} />
					</Box>
					<Box sx={{ textAlign: 'left', ml: 0.5 }}>
						<b>{t('bet')}:</b> {betTitle}
					</Box>
					<Box sx={{ textAlign: 'left', ml: 0.5 }}>
						<b>{t('coef')}:</b> {betOdds?.toFixed(2)}, <b>{t('amount')}:</b> {betSize}
					</Box>
				</Box>
			)}
		</>
	);
}
