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
import { MATCHDAY_TITLE_FINAL } from '../../constants';

const getIsPlayoff = (title: string): boolean => {
	return title === MATCHDAY_TITLE_FINAL || title.startsWith('1/');
};

const getMatchday = (title: string): string => {
	const index = title.indexOf('[');
	return index !== -1 ? title.substring(0, index).trim() : title;
};

const getPlayoffRound = (title: string): string => {
	const index = title.indexOf('[');
	return index !== -1 ? title[index + 1] : '';
};

export default function MatchDayForm({
	matchDay,
	onMatchDay,
}: {
	matchDay: string;
	onMatchDay: (matchDay: string) => void;
}): JSX.Element {
	const [updatedIsPlayoff, setUpdatedIsPlayoff] = useState<boolean>(getIsPlayoff(matchDay));
	const [updatedMatchDay, setUpdatedMatchDay] = useState<string>(getMatchday(matchDay));
	const [updatedPlayoffRound, setUpdatedPlayoffRound] = useState<string>(getPlayoffRound(matchDay));

	const playoffMatchDayList: string[] = ['1/16', '1/8', '1/4', '1/2', MATCHDAY_TITLE_FINAL];
	const playoffRoundsList: string[] = ['', '1', '2', '3', '4'];

	const championsLeaguePlayoffMappings: Record<string, string> = {
		'7': '1/8',
		'8': '1/8',
		'9': '1/8',
		'10': '1/8',
		'11': '1/4',
		'12': '1/4',
		'13': '1/2',
		'14': '1/2',
		'15': MATCHDAY_TITLE_FINAL,
	};

	const championsLeaguePlayoffRoundMappings: Record<string, string> = {
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
		let res = updatedMatchDay;
		if (updatedIsPlayoff && updatedPlayoffRound !== '') {
			res = updatedMatchDay + ' [' + updatedPlayoffRound + ']';
		}
		onMatchDay(res);
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
		if (e.target.value === MATCHDAY_TITLE_FINAL) {
			setUpdatedPlayoffRound('');
		}
		setUpdatedMatchDay(e.target.value);
	};

	const handlePlayoffRoundSelect = (e: SelectChangeEvent): void => {
		setUpdatedPlayoffRound(e.target.value);
	};

	const handleIsPlayoffBet = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const flag = event.target.checked;
		setUpdatedIsPlayoff(flag);

		const matchDayTransform = flag
			? championsLeaguePlayoffMappings[updatedMatchDay] || '1/8'
			: getIsPlayoff(matchDay)
			? '1'
			: matchDay;

		const playoffRoundValue = flag
			? championsLeaguePlayoffRoundMappings[updatedMatchDay] || ''
			: getPlayoffRound(matchDay);

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
									<Typography sx={{ mx: 1, fontSize: '1rem' }}>
										{t(`playoffRound.${value}`)}
									</Typography>
								</Box>
							</MenuItem>
						))}
					</Select>
					<Select
						disabled={updatedMatchDay === MATCHDAY_TITLE_FINAL ? true : false}
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
