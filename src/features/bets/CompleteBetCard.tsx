import { GppBad, GppGood, RestorePage } from '@mui/icons-material';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import TeamsAvatars from '../../components/custom/avatar/TeamsAvatars';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import { getGameResultView } from '../../components/utils/gameResultValidation';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import { BET_STATUS_RETURNED, BET_STATUS_WON } from '../../constants';
import Bet from './types/Bet';

export default function CompleteBetCard({ bet }: { bet: Bet }): JSX.Element {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;
	const [matchDayTitle, setMatchDayTitle] = useState<string>('');

	useEffect(() => {
		setMatchDayTitle(matchDayTitleViewTransform(bet.matchDay, currentLanguage));
	}, [bet, currentLanguage]);

	const {
		leagueCode,
		player,
		homeTeam,
		awayTeam,
		betTitle,
		betOdds,
		betSize,
		gameResult,
		betStatus,
		balanceChange,
	} = bet;

	const gameResultView = getGameResultView(gameResult);

	return (
		<Box
			sx={{
				maxWidth: '25rem',
				minWidth: '19rem',
				border: 2,
				mx: 0.5,
				my: 0.5,
				p: 0.5,
				borderRadius: 2,
				bgcolor:
					betStatus === BET_STATUS_WON
						? '#daf3db'
						: betStatus === BET_STATUS_RETURNED
						? '#f8f9d6'
						: '#f3dada',
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
			<TeamsAvatars homeTeam={homeTeam} awayTeam={awayTeam} />
			<Box sx={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 600 }}>{gameResultView}</Box>
			<Box sx={{ textAlign: 'left', ml: 0.5 }}>
				<b>{t('bet')}:</b> {getFullBetTitle(betTitle)}
			</Box>
			<Box sx={{ textAlign: 'left', ml: 0.5 }}>
				<b>{t('coef')}:</b> {betOdds?.toFixed(2)}, <b>{t('amount')}:</b> {betSize}
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Box>
					<Box
						sx={{
							fontSize: '0.85rem',
							fontWeight: 600,
							pl: 0.5,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{betStatus === BET_STATUS_WON ? (
							<GppGood sx={{ color: 'green' }} />
						) : betStatus === BET_STATUS_RETURNED ? (
							<RestorePage sx={{ color: '#b89e00' }} />
						) : (
							<GppBad sx={{ color: '#bd0000' }} />
						)}

						{betStatus === BET_STATUS_WON
							? t('betWon')
							: betStatus === BET_STATUS_RETURNED
							? t('betReturned')
							: t('betLost')}
					</Box>
				</Box>
				{balanceChange !== undefined && (
					<Box
						sx={{
							pr: 1,
							fontWeight: 600,
							fontSize: '1.4rem',
							color: balanceChange > 0 ? 'green' : balanceChange < 0 ? 'brown' : 'black',
						}}
					>
						{Number.isInteger(balanceChange) ? balanceChange : balanceChange.toFixed(2)}€
					</Box>
				)}
			</Box>
		</Box>
	);
}
