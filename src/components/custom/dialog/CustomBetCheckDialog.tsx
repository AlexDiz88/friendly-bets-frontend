import { Dialog, DialogActions, DialogContent, DialogContentText, Typography } from '@mui/material';
import { t } from 'i18next';
import BetGameResultInfo from '../../../features/bets/BetGameResultInfo';
import Bet from '../../../features/bets/types/Bet';
import TeamsInfo from '../../TeamsInfo';
import CustomButton from '../btn/CustomButton';
import CustomCancelButton from '../btn/CustomCancelButton';

interface BetDialogProps {
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
}: BetDialogProps): JSX.Element {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent>
				<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
					<BetGameResultInfo gameResult={gameResult} />
				</DialogContentText>
				<TeamsInfo homeTeam={bet?.homeTeam} awayTeam={bet?.awayTeam} />
				<Typography sx={{ fontSize: '0.9rem' }}>
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
