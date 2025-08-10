import { Box } from '@mui/material';
import { t } from 'i18next';
import {
	gameScoreInputStringValidation,
	getGameScoreView,
	transformToGameScore,
} from '../../components/utils/gameScoreValidation';

export default function BetGameScoreInfo({
	gameScoreInput,
}: {
	gameScoreInput: string | undefined;
}): JSX.Element {
	const checkedGameScore = gameScoreInputStringValidation(gameScoreInput);
	const gameScoreObj = transformToGameScore(checkedGameScore);
	const gameScoreView = getGameScoreView(gameScoreObj);
	return (
		<>
			<Box sx={{ textAlign: 'left', borderBottom: 1, pb: 0.3, mb: 1.5 }}>
				<b>{t('acceptBet')}</b>
			</Box>
			<Box
				sx={{
					color:
						checkedGameScore === t('error.incorrectGameScore') ||
						checkedGameScore === t('notSpecified')
							? 'brown'
							: 'inherit',
				}}
			>
				{checkedGameScore !== t('error.incorrectGameScore')
					? `${t('finalScore')} - ${gameScoreView}`
					: checkedGameScore}
			</Box>
		</>
	);
}
