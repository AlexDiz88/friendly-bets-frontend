import { GppBad, GppGood, RestorePage } from '@mui/icons-material';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import TeamsAvatars from '../../components/custom/avatar/TeamsAvatars';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import { BET_STATUS_RETURNED, BET_STATUS_WON } from '../../constants';
import {
	BETS_CARD_LOGO_SIZE,
	BETS_CARD_USER_AVATAR_SIZE,
	betsBalanceChangeSx,
	betsCardAvatarSx,
	betsCardBodySx,
	betsCardHeaderRowSx,
	betsCardLabelSx,
	betsCardScoreSx,
	betsCardStatusLabelSx,
	betsCardStatusRowSx,
	betsCardSx,
	betsCardTeamsSx,
	betsCompletedCardBgSx,
	betsStatusIconSx,
} from './betsPageStyles';
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
		gameScore,
		betStatus,
		balanceChange,
	} = bet;

	const gameScoreView = getGameScoreView(gameScore);
	const statusKind =
		betStatus === BET_STATUS_WON ? 'won' : betStatus === BET_STATUS_RETURNED ? 'returned' : 'lost';

	return (
		<Box sx={[betsCardSx, betsCompletedCardBgSx(statusKind)] as SxProps<Theme>}>
			<Box sx={betsCardHeaderRowSx}>
				<UserAvatar
					player={player}
					height={BETS_CARD_USER_AVATAR_SIZE}
					sx={betsCardAvatarSx}
				/>
				<LeagueAvatar
					leagueCode={leagueCode}
					matchDay={matchDayTitle}
					height={BETS_CARD_LOGO_SIZE}
					sx={betsCardAvatarSx}
				/>
			</Box>
			<TeamsAvatars
				homeTeam={homeTeam}
				awayTeam={awayTeam}
				height={BETS_CARD_LOGO_SIZE}
				sx={betsCardTeamsSx}
			/>
			<Typography component="div" sx={betsCardScoreSx}>
				{gameScoreView}
			</Typography>
			<Typography component="div" sx={betsCardBodySx}>
				<Box component="span" sx={betsCardLabelSx}>
					{t('bet')}:
				</Box>{' '}
				{getFullBetTitle(betTitle)}
			</Typography>
			<Typography component="div" sx={betsCardBodySx}>
				<Box component="span" sx={betsCardLabelSx}>
					{t('coef')}:
				</Box>{' '}
				{betOdds?.toFixed(2)},{' '}
				<Box component="span" sx={betsCardLabelSx}>
					{t('amount')}:
				</Box>{' '}
				{betSize}
			</Typography>
			<Box sx={betsCardStatusRowSx}>
				<Box sx={betsCardStatusLabelSx}>
					{betStatus === BET_STATUS_WON ? (
						<GppGood sx={betsStatusIconSx('won')} />
					) : betStatus === BET_STATUS_RETURNED ? (
						<RestorePage sx={betsStatusIconSx('returned')} />
					) : (
						<GppBad sx={betsStatusIconSx('lost')} />
					)}
					{betStatus === BET_STATUS_WON
						? t('betWon')
						: betStatus === BET_STATUS_RETURNED
							? t('betReturned')
							: t('betLost')}
				</Box>
				{balanceChange !== undefined && (
					<Box sx={betsBalanceChangeSx(balanceChange)}>
						{Number.isInteger(balanceChange) ? balanceChange : balanceChange.toFixed(2)}€
					</Box>
				)}
			</Box>
		</Box>
	);
}
