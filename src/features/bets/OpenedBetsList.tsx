import { Box, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import useFilterLanguageChange from '../../components/hooks/useFilterLanguageChange';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import PlayerSelect from '../../components/selectors/PlayerSelect';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import BetCard from './BetCard';
import { getOpenedBets } from './betsSlice';
import { selectOpenedBets } from './selectors';

const OpenedBetsList = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const openedBets = useAppSelector(selectOpenedBets);
	const [filteredBets, setFilteredBets] = useState(openedBets);
	const [selectedLeagueCode, setSelectedLeagueCode] = useState<string>(t('all'));
	const [selectedPlayerName, setSelectedPlayerName] = useState<string>(t('all'));
	const [loading, setLoading] = useState(true);

	const filterOpenedBets = (leagueName: string, playerName: string): void => {
		let filtered = openedBets;
		if (playerName === t('all') && leagueName !== t('all')) {
			filtered = openedBets.filter((bet) => bet.leagueCode === leagueName);
		}
		if (playerName !== t('all') && leagueName === t('all')) {
			filtered = openedBets.filter((bet) => bet.player.username === playerName);
		}
		if (playerName !== t('all') && leagueName !== t('all')) {
			filtered = openedBets.filter(
				(bet) => bet.leagueCode === leagueName && bet.player.username === playerName
			);
		}
		setFilteredBets(filtered);
	};

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setSelectedLeagueCode(e.target.value);
		filterOpenedBets(e.target.value, selectedPlayerName);
	};

	const handlePlayerChange = (e: SelectChangeEvent): void => {
		const player = e.target.value;
		setSelectedPlayerName(player);
		filterOpenedBets(selectedLeagueCode, player);
	};

	useFilterLanguageChange(setSelectedLeagueCode, setSelectedPlayerName, filterOpenedBets);

	useEffect(() => {
		setFilteredBets(openedBets);
	}, [openedBets]);

	useEffect(() => {
		if (activeSeason) {
			dispatch(getOpenedBets({ seasonId: activeSeason.id }))
				.unwrap()
				.then(() => {
					setLoading(false);
				});
		}
	}, [activeSeason]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, []);

	return (
		<>
			{loading ? (
				<CustomLoading />
			) : (
				<>
					<Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
						<LeagueSelect
							value={selectedLeagueCode}
							onChange={handleLeagueChange}
							leagues={activeSeason?.leagues}
						/>

						<PlayerSelect
							value={selectedPlayerName}
							onChange={handlePlayerChange}
							players={activeSeason?.players}
						/>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
						{filteredBets &&
							filteredBets.map((bet) => (
								<Box key={bet.id}>
									<BetCard bet={bet} />
								</Box>
							))}
					</Box>
				</>
			)}
		</>
	);
};

export default OpenedBetsList;
