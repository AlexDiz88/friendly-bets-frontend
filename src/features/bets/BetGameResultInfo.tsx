import { Box } from '@mui/material';
import { t } from 'i18next';
import {
	gameScoreValidation,
	getGameResultView,
	transformToGameResult,
} from '../../components/utils/gameResultValidation';

export default function BetGameResultInfo({
	gameResultInput,
}: {
	gameResultInput: string | undefined;
}): JSX.Element {
	const checkedGameResult = gameScoreValidation(gameResultInput);
	const gameResultObj = transformToGameResult(checkedGameResult);
	const gameScoreView = getGameResultView(gameResultObj);
	return (
		<>
			<Box sx={{ textAlign: 'left', borderBottom: 1, pb: 0.3, mb: 1.5 }}>
				<b>{t('acceptBet')}</b>
			</Box>
			<Box
				sx={{
					color:
						checkedGameResult === t('incorrectGameScore') || checkedGameResult === t('notSpecified')
							? 'brown'
							: 'inherit',
				}}
			>
				{checkedGameResult !== t('incorrectGameScore')
					? `${t('finalScore')} - ${gameScoreView}`
					: checkedGameResult}
			</Box>
		</>
	);
}
