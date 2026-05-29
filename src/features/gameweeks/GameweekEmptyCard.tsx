import { GppMaybe } from '@mui/icons-material';
import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import Bet from '../bets/types/Bet';
import {
	gameweekBalanceChangeSx,
	gameweekCompactStatusCardSx,
	gameweekStatusIconSx,
} from './gameweekPageStyles';

const GameweekEmptyCard = ({ bet, onClick }: { bet: Bet; onClick: () => void }): JSX.Element => {
	return (
		<Box sx={gameweekCompactStatusCardSx('empty')} onClick={onClick}>
			<Box
				sx={{
					fontSize: '0.85rem',
					fontWeight: 600,
					pl: 0.5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<GppMaybe sx={gameweekStatusIconSx('empty')} />
				{t('betNotPlacedShort')}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Avatar
						sx={
							[
								{ mr: 0.5, width: 30, height: 30 },
								leagueLogoAvatarSx,
							] as SxProps<Theme>
						}
						variant="square"
						alt="league_logo"
						src={pathToLogoImage(bet.leagueCode)}
					/>
					{bet.balanceChange !== undefined && (
						<Box sx={[gameweekBalanceChangeSx(bet.balanceChange), { fontSize: '1rem' }] as SxProps<Theme>}>
							{bet.balanceChange}€
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default GameweekEmptyCard;
