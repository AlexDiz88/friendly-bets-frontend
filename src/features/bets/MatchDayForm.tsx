import { AddCircle, RemoveCircle } from '@mui/icons-material';
import {
	Box,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import MatchDayInfo from './types/MatchDayInfo';

export default function MatchDayForm({
	matchDayInfo,
	onMatchDayInfo,
}: {
	matchDayInfo: MatchDayInfo;
	onMatchDayInfo: (matchDayInfo: MatchDayInfo) => void;
}): JSX.Element {
	const [updatedIsPlayoff, setUpdatedIsPlayoff] = useState<boolean>(matchDayInfo.isPlayoff);
	const [updatedMatchDay, setUpdatedMatchDay] = useState<string>(matchDayInfo.matchDay);
	const [updatedPlayoffRound, setUpdatedPlayoffRound] = useState<string>(matchDayInfo.playoffRound);

	const playoffMatchDayList: string[] = [
		t(`playoffRound.1/16`),
		t(`playoffRound.1/8`),
		t(`playoffRound.1/4`),
		t(`playoffRound.1/2`),
		t(`playoffRound.final`),
	];
	const playoffRoundsList: string[] = ['', '1', '2', '3', '4'];

	const playoffMappings: Record<string, string> = {
		'7': t(`playoffRound.1/8`),
		'8': t(`playoffRound.1/8`),
		'9': t(`playoffRound.1/8`),
		'10': t(`playoffRound.1/8`),
		'11': t(`playoffRound.1/4`),
		'12': t(`playoffRound.1/4`),
		'13': t(`playoffRound.1/2`),
		'14': t(`playoffRound.1/2`),
		'15': t(`playoffRound.final`),
	};

	const playoffRoundMappings: Record<string, string> = {
		'7': '1',
		'8': '2',
		'9': '3',
		'10': '4',
		'11': '1',
		'12': '2',
		'13': '1',
		'14': '2',
		'15': '',
	};

	useEffect(() => {
		onMatchDayInfo({
			isPlayoff: updatedIsPlayoff,
			matchDay: updatedMatchDay,
			playoffRound: updatedPlayoffRound,
		});
	}, [updatedIsPlayoff, updatedMatchDay, updatedPlayoffRound]);

	const handleIncrement = (): void => {
		setUpdatedMatchDay((prevValue) => {
			const newValue = playoffMatchDayList.includes(updatedMatchDay)
				? '1'
				: (Number(prevValue) + 1).toString();
			return newValue;
		});
	};

	const handleDecrement = (): void => {
		setUpdatedMatchDay((prevValue) => {
			const newValue =
				Number(prevValue) - 1 < 1 || playoffMatchDayList.includes(updatedMatchDay)
					? '1'
					: (Number(prevValue) - 1).toString();
			return newValue;
		});
	};

	const handleMatchDayChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUpdatedMatchDay(e.target.value);
	};

	const handleMatchDaySelect = (e: SelectChangeEvent): void => {
		setUpdatedMatchDay(e.target.value);
	};

	const handlePlayoffRoundSelect = (e: SelectChangeEvent): void => {
		setUpdatedPlayoffRound(e.target.value);
	};

	const handleIsPlayoffBet = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const flag = event.target.checked;
		setUpdatedIsPlayoff(flag);

		const matchDayTransform = flag
			? playoffMappings[updatedMatchDay] || t(`playoffRound.1/8`)
			: matchDayInfo.matchDay.includes('1/') || matchDayInfo.matchDay === t(`playoffRound.final`)
			? '1'
			: matchDayInfo.matchDay;

		const playoffRoundValue = flag
			? playoffRoundMappings[updatedMatchDay] || ''
			: matchDayInfo.playoffRound;

		setUpdatedMatchDay(matchDayTransform);
		setUpdatedPlayoffRound(playoffRoundValue);
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography sx={{ mx: 1, fontWeight: '600' }}>{t('matchday')}</Typography>
				<Typography sx={{ textAlign: 'left', mx: 0, mt: 0.8, fontWeight: '600' }}>
					Play-off?
					<Switch
						checked={updatedIsPlayoff}
						onChange={handleIsPlayoffBet}
						inputProps={{ 'aria-label': 'controlled' }}
					/>
				</Typography>
			</Box>
			{!updatedIsPlayoff ? (
				<Box
					component="form"
					autoComplete="off"
					display="flex"
					alignItems="center"
					sx={{ minWidth: '5rem', pt: 0 }}
				>
					<IconButton onClick={handleDecrement}>
						<RemoveCircle color="info" sx={{ fontSize: '2.5rem' }} />
					</IconButton>
					<TextField
						size="small"
						type="number"
						value={updatedMatchDay}
						onChange={handleMatchDayChange}
						inputProps={{
							min: 0,
							max: 50,
						}}
					/>
					<IconButton onClick={handleIncrement}>
						<AddCircle color="info" sx={{ fontSize: '2.5rem' }} />
					</IconButton>
				</Box>
			) : (
				<Box>
					<Select
						autoWidth
						size="small"
						sx={{ minWidth: '11rem', mt: 1.5, mb: 0.6 }}
						labelId="playoff-matchday-label"
						id="playoff-matchday-select"
						value={updatedMatchDay}
						onChange={handleMatchDaySelect}
					>
						{playoffMatchDayList.map((value) => (
							<MenuItem key={value} sx={{ ml: -0.5, minWidth: '6rem' }} value={value}>
								<Box style={{ display: 'flex', alignItems: 'center' }}>
									<Typography sx={{ mx: 1, fontSize: '1rem' }}>{value}</Typography>
								</Box>
							</MenuItem>
						))}
					</Select>
					<Select
						autoWidth
						size="small"
						sx={{ minWidth: '4rem', mt: 1.5, mb: 0.6 }}
						labelId="playoff-round-label"
						id="playoff-round-select"
						value={updatedPlayoffRound}
						onChange={handlePlayoffRoundSelect}
					>
						{playoffRoundsList.map((value) => (
							<MenuItem key={value} sx={{ ml: -0.5, minWidth: '6rem' }} value={value}>
								<Box style={{ display: 'flex', alignItems: 'center' }}>
									<Typography sx={{ mx: 1, fontSize: '1rem' }}>{value}</Typography>
								</Box>
							</MenuItem>
						))}
					</Select>
				</Box>
			)}
		</Box>
	);
}
