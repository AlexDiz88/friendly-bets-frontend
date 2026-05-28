import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import ScoreSelector from '../../components/custom/selectors/ScoreSelector';
import GameScore from '../bets/types/GameScore';
import { ExternalMatch } from './types/ExternalMatch';

interface GameResultScoreEditDialogProps {
	open: boolean;
	match: ExternalMatch | null;
	onClose: () => void;
	onSave: (score: GameScore) => Promise<void>;
}

export default function GameResultScoreEditDialog({
	open,
	match,
	onClose,
	onSave,
}: GameResultScoreEditDialogProps): JSX.Element {
	const { t } = useTranslation();
	const [scoreValid, setScoreValid] = useState(false);
	const [pendingScore, setPendingScore] = useState<GameScore | null>(null);
	const [saving, setSaving] = useState(false);

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
					disabled={!scoreValid || saving}
					sx={{ mt: 1, width: '100%' }}
				/>
				<CustomCancelButton buttonText={t('btnText.cancel')} onClick={onClose} sx={{ mt: 1, width: '100%' }} />
			</DialogContent>
		</Dialog>
	);
}
