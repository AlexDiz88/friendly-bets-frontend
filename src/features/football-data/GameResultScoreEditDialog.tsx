import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import CustomButton from '../../components/custom/btn/CustomButton';
import ScoreSelector from '../../components/custom/selectors/ScoreSelector';
import GameScore from '../bets/types/GameScore';
import { useAppDispatch } from '../../app/hooks';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import { ExternalMatch } from './types/ExternalMatch';

interface GameResultScoreEditDialogProps {
	open: boolean;
	match: ExternalMatch | null;
	onClose: () => void;
	onSave: (score: GameScore) => Promise<void>;
	onApplyApiScore?: () => Promise<void>;
}

export default function GameResultScoreEditDialog({
	open,
	match,
	onClose,
	onSave,
	onApplyApiScore,
}: GameResultScoreEditDialogProps): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [scoreValid, setScoreValid] = useState(false);
	const [pendingScore, setPendingScore] = useState<GameScore | null>(null);
	const [saving, setSaving] = useState(false);
	const [applyingApi, setApplyingApi] = useState(false);

	const handleSave = async (): Promise<void> => {
		if (!pendingScore?.fullTime || !scoreValid) {
			return;
		}
		setSaving(true);
		try {
			await onSave(pendingScore);
			onClose();
		} finally {
			setSaving(false);
		}
	};

	const handleApplyApi = async (): Promise<void> => {
		if (!onApplyApiScore) {
			return;
		}
		setApplyingApi(true);
		try {
			await onApplyApiScore();
			onClose();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('gameResultApplyApiScoreError'),
				})
			);
		} finally {
			setApplyingApi(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
				{t('gameResultEditScoreTitle')}
			</DialogTitle>
			<DialogContent sx={{ pt: 1 }}>
				{match && (
					<ScoreSelector
						keyId={match.id ?? String(match.externalMatchId)}
						initialValue={match.gameScore ?? { fullTime: null, firstTime: null, overTime: null, penalty: null }}
						onSave={(val) => setPendingScore(val)}
						onValidationChange={setScoreValid}
					/>
				)}
				<CustomSuccessButton
					buttonText={t('btnText.save')}
					onClick={() => void handleSave()}
					disabled={!scoreValid || saving || applyingApi}
					sx={{ mt: 1, width: '100%' }}
				/>
				{onApplyApiScore ? (
					<CustomButton
						buttonText={t('gameResultApplyApiScore')}
						onClick={() => void handleApplyApi()}
						disabled={saving || applyingApi}
						sx={{ mt: 1, width: '100%' }}
					/>
				) : null}
				<CustomCancelButton buttonText={t('btnText.cancel')} onClick={onClose} sx={{ mt: 1, width: '100%' }} />
			</DialogContent>
		</Dialog>
	);
}
