import { GppMaybe } from '@mui/icons-material';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import {
	BETS_CARD_LOGO_SIZE,
	BETS_CARD_USER_AVATAR_SIZE,
	betsBalanceChangeSx,
	betsCardAvatarSx,
	betsCardBodySx,
	betsCardHeaderRowSx,
	betsCardLabelSx,
	betsCardStatusLabelSx,
	betsCardStatusRowSx,
	betsCardSx,
	betsCompletedCardBgSx,
	betsStatusIconSx,
} from './betsPageStyles';
import Bet from './types/Bet';

export default function EmptyBetCard({ bet }: { bet: Bet }): JSX.Element {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;
	const [matchDayTitle, setMatchDayTitle] = useState<string>('');
	const { leagueCode, player, balanceChange, betSize } = bet;

	useEffect(() => {
		setMatchDayTitle(matchDayTitleViewTransform(bet.matchDay, currentLanguage));
	}, [bet, currentLanguage]);

	return (
		<>
			{bet && (
				<Box sx={[betsCardSx, betsCompletedCardBgSx('empty')] as SxProps<Theme>}>
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
					<Typography component="div" sx={betsCardBodySx}>
						<Box component="span" sx={betsCardLabelSx}>
							{t('amount')}:
						</Box>{' '}
						{betSize}
					</Typography>

					<Box sx={betsCardStatusRowSx}>
						<Box sx={betsCardStatusLabelSx}>
							<GppMaybe sx={betsStatusIconSx('empty')} />
							{t('betNotPlaced')}
						</Box>
						{balanceChange !== undefined && (
							<Box sx={betsBalanceChangeSx(balanceChange)}>{balanceChange}€</Box>
						)}
					</Box>
				</Box>
			)}
		</>
	);
}
