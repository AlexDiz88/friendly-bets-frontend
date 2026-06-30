import { GppMaybe } from '@mui/icons-material';
import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import Bet from '../bets/types/Bet';
import {
	gameweekBalanceChangeSx,
	gameweekBetOutcomeRowSx,
	gameweekCompactStatusCardSx,
	gameweekEmptyCardTextSx,
	gameweekStatusIconSx,
} from './gameweekPageStyles';

const SIDE_SLOT_SIZE = 30;

const GameweekEmptyCard = ({ bet, onClick }: { bet: Bet; onClick: () => void }): JSX.Element => {
	return (
		<Box sx={gameweekCompactStatusCardSx('empty')} onClick={onClick}>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Box sx={{ width: SIDE_SLOT_SIZE, height: SIDE_SLOT_SIZE, flexShrink: 0 }} />
					<Box sx={gameweekEmptyCardTextSx}>
						<Box>{t('betNotPlacedShortLine1')}</Box>
						<Box>{t('betNotPlacedShortLine2')}</Box>
					</Box>
					<Avatar
						sx={
							[
								{ width: SIDE_SLOT_SIZE, height: SIDE_SLOT_SIZE, flexShrink: 0 },
								leagueLogoAvatarSx,
							] as SxProps<Theme>
						}
						variant="square"
						alt="league_logo"
						src={pathToLogoImage(bet.leagueCode)}
					/>
				</Box>
			</Box>

			<Box sx={gameweekBetOutcomeRowSx}>
				<GppMaybe sx={gameweekStatusIconSx('empty')} />
				{bet.balanceChange !== undefined && (
					<Box
						sx={
							[
								gameweekBalanceChangeSx(bet.balanceChange),
								{ fontSize: '1.1rem', lineHeight: 1 },
							] as SxProps<Theme>
						}
					>
						{Number.isInteger(bet.balanceChange) ? bet.balanceChange : bet.balanceChange.toFixed(2)}€
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default GameweekEmptyCard;
