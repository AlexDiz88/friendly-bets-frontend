import { Add, Remove } from '@mui/icons-material';
import { Box, Collapse, FormControlLabel, IconButton, Switch, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import GameScore from '../../../features/bets/types/GameScore';
import { parseScore, validateGameScore } from '../../utils/gameScoreValidation';

interface ScoreFieldProps {
	label: string;
	value: string | null;
	onChange: (val: string) => void;
}

const ScoreField = ({ label, value, onChange }: ScoreFieldProps): JSX.Element => {
	const [home, away] = value?.split(':').map(Number) ?? [0, 0];

	const handleChange = (type: 'home' | 'away', dir: 1 | -1): void => {
		const newHome = type === 'home' ? Math.max(0, home + dir) : home;
		const newAway = type === 'away' ? Math.max(0, away + dir) : away;
		onChange(`${newHome}:${newAway}`);
	};

	return (
		<Box mb={2}>
			<Typography fontWeight={600} mb={0.5} align="center">
				{label}
			</Typography>
			<Box display="flex" alignItems="center" justifyContent="center">
				{[
					['home', home],
					['away', away],
				].map(([type, val]) => (
					<Box key={type as string} display="flex" alignItems="center" mx={2}>
						<IconButton size="large" onClick={() => handleChange(type as 'home' | 'away', -1)}>
							<Remove fontSize="large" />
						</IconButton>
						<Typography fontSize={48}>{val}</Typography>
						<IconButton size="large" onClick={() => handleChange(type as 'home' | 'away', 1)}>
							<Add fontSize="large" />
						</IconButton>
					</Box>
				))}
			</Box>
		</Box>
	);
};

interface ScoreSelectorProps {
	keyId: string;
	initialValue: GameScore | null;
	onSave: (val: GameScore) => void;
	onValidationChange?: (isValid: boolean) => void;
	onValidationError?: (error: string | null) => void;
}

export default function ScoreSelector({
	initialValue,
	onSave,
	onValidationChange,
	onValidationError,
}: ScoreSelectorProps): JSX.Element {
	const [fullTime, setFullTime] = useState<string>(initialValue?.fullTime ?? '0:0');
	const [firstTime, setFirstTime] = useState<string>(initialValue?.firstTime ?? '0:0');
	const [overTime, setOverTime] = useState<string>(initialValue?.overTime ?? '0:0');
	const [penalty, setPenalty] = useState<string>(initialValue?.penalty ?? '0:0');
	const [showExtra, setShowExtra] = useState<boolean>(
		!!(initialValue?.overTime || initialValue?.penalty)
	);
	const [isValid, setIsValid] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const result: GameScore = {
			fullTime,
			firstTime,
			overTime: showExtra ? overTime : null,
			penalty: showExtra && parseScore(overTime)[0] === parseScore(overTime)[1] ? penalty : null,
		};
		const validation = validateGameScore(result);
		setIsValid(validation.valid);
		setError(Object.values(validation.errors)[0] ?? null);
		onSave(result);
		onValidationChange?.(validation.valid);
	}, [fullTime, firstTime, overTime, penalty, showExtra]);

	useEffect(() => {
		if (onValidationChange) onValidationChange(isValid);
		if (onValidationError) onValidationError(error);
	}, [isValid, error]);

	return (
		<Box mt={2}>
			<ScoreField label={t('fullTime')} value={fullTime} onChange={setFullTime} />
			<ScoreField label={t('halfTime')} value={firstTime} onChange={setFirstTime} />

			<Box sx={{ mb: 2 }}>
				<FormControlLabel
					control={<Switch checked={showExtra} onChange={() => setShowExtra(!showExtra)} />}
					label={t('addExtraTimes')}
				/>
			</Box>

			<Collapse in={showExtra}>
				<ScoreField label={t('overtime')} value={overTime} onChange={setOverTime} />

				{(() => {
					const [homeOT, awayOT] = overTime.split(':').map(Number);
					if (homeOT === awayOT) {
						return <ScoreField label={t('penalty')} value={penalty} onChange={setPenalty} />;
					}
					return null;
				})()}
			</Collapse>
		</Box>
	);
}
