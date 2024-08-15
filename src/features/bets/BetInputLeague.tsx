import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import League from '../admin/leagues/types/League';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';

export default function BetInputLeague({
	onLeagueSelect,
}: {
	onLeagueSelect: (league: League) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const leagues = activeSeason?.leagues;
	const [selectedLeagueName, setSelectedLeagueName] = useState<string>('');

	const handleSeasonChange = (event: SelectChangeEvent): void => {
		const leagueName = event.target.value;
		setSelectedLeagueName(leagueName);
		const selectedLeague = leagues?.find((l) => l.leagueCode === leagueName);
		if (selectedLeague) {
			onLeagueSelect(selectedLeague);
		}
	};

	useEffect(() => {
		if (leagues?.length === 1) {
			setSelectedLeagueName(leagues[0].leagueCode);
			onLeagueSelect(leagues[0]);
		}
	}, [leagues]);

	useEffect(() => {
		dispatch(getActiveSeason());
	}, [dispatch, selectedLeagueName]);

	return (
		<Box sx={{ textAlign: 'left' }}>
			<Typography sx={{ mx: 1, fontWeight: '600' }}>{t('league')}</Typography>
			<Select
				autoWidth
				size="small"
				sx={{ minWidth: '15rem', mb: 1 }}
				labelId="season-title-label"
				id="season-title-select"
				value={selectedLeagueName}
				onChange={handleSeasonChange}
			>
				{leagues &&
					leagues.map((l) => (
						<MenuItem sx={{ mx: 0, minWidth: '14.5rem' }} key={l.id} value={l.leagueCode}>
							<LeagueAvatar leagueCode={l.leagueCode} fullName sx={{ justifyContent: 'start' }} />
						</MenuItem>
					))}
			</Select>
		</Box>
	);
}
