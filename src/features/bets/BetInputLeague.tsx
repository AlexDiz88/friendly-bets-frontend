import { useEffect, useState } from 'react';
import { Avatar, Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import League from '../admin/leagues/types/League';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import { t } from 'i18next';

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
		const selectedLeague = leagues?.find((l) => l.displayNameRu === leagueName);
		if (selectedLeague) {
			onLeagueSelect(selectedLeague);
		}
	};

	useEffect(() => {
		if (leagues?.length === 1) {
			setSelectedLeagueName(leagues[0].displayNameRu);
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
						<MenuItem sx={{ mx: 0, minWidth: '14.5rem' }} key={l.id} value={l.displayNameRu}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Avatar
									sx={{ width: 27, height: 27 }}
									alt="league_logo"
									src={pathToLogoImage(l.displayNameEn)}
								/>

								<Typography sx={{ mx: 1, fontSize: '1rem' }}>{l.displayNameRu}</Typography>
							</div>
						</MenuItem>
					))}
			</Select>
		</Box>
	);
}
