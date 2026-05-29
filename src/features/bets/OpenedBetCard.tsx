import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import TeamsAvatars from '../../components/custom/avatar/TeamsAvatars';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import {
	BETS_CARD_LOGO_SIZE,
	BETS_CARD_USER_AVATAR_SIZE,
	betsCardAvatarSx,
	betsCardBodySx,
	betsCardHeaderRowSx,
	betsCardLabelSx,
	betsCardSx,
	betsCardTeamsRowSx,
	betsCardTeamsSx,
} from './betsPageStyles';
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
				<Box sx={betsCardSx}>
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
					<Box sx={betsCardTeamsRowSx}>
						<TeamsAvatars
							homeTeam={homeTeam}
							awayTeam={awayTeam}
							height={BETS_CARD_LOGO_SIZE}
							sx={betsCardTeamsSx}
						/>
					</Box>
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
				</Box>
			)}
		</>
	);
}
