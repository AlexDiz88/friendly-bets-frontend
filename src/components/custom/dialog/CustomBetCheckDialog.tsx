import { Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { t } from 'i18next';
import BetGameResultInfo from '../../../features/bets/BetGameResultInfo';
import Bet from '../../../features/bets/types/Bet';
import TeamAvatar from '../avatar/TeamAvatar';
import CustomButton from '../btn/CustomButton';
import CustomCancelButton from '../btn/CustomCancelButton';

interface DialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	gameResult: string;
	bet?: Bet;
	buttonColor?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';
	buttonText: string;
	sx?: {};
}

export default function CustomBetCheckDialog({
	open,
	onClose,
	onSave,
	gameResult,
	bet,
	buttonColor = 'primary',
	buttonText,
	sx,
}: DialogProps): JSX.Element {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent>
				<Box sx={{ fontWeight: '600', fontSize: '1rem' }}>
					<BetGameResultInfo gameResult={gameResult} />
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<b>{t('homeTeam')}:</b>
					<TeamAvatar team={bet?.homeTeam} />
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<b>{t('awayTeam')}:</b>
					<TeamAvatar team={bet?.awayTeam} />
				</Box>
				<Typography>
					<b>{t('bet')}:</b> {bet?.betTitle || ''}
				</Typography>
			</DialogContent>
			<DialogActions>
				<CustomCancelButton onClick={onClose} buttonVariant="outlined" />
				<CustomButton
					sx={{ height: '2rem', ...sx }}
					onClick={onSave}
					buttonText={buttonText}
					buttonColor={buttonColor}
					autoFocus
				/>
			</DialogActions>
		</Dialog>
	);
}
