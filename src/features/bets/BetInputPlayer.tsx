import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import { sortPlayersForSelect } from '../../components/selectors/sortPlayersForSelect';
import {
	betInputPlayerMenuItemSx,
	betInputPlayerSelectMenuProps,
	betInputSelectSx,
} from './betInputPageStyles';
import { selectActiveSeason } from '../admin/seasons/selectors';
import SimpleUser from '../auth/types/SimpleUser';

export default function BetInputPlayer({
	defaultValue,
	onUserSelect,
}: {
	defaultValue: SimpleUser | undefined;
	onUserSelect: (user: SimpleUser) => void;
}): JSX.Element {
	const activeSeason = useAppSelector(selectActiveSeason);
	const players = activeSeason?.players;
	const sortedPlayers = useMemo(
		() => (players ? sortPlayersForSelect(players) : []),
		[players]
	);
	const [selectedUsername, setSelectedUsername] = useState<string>(defaultValue?.username || '');

	const handleSeasonChange = (event: SelectChangeEvent): void => {
		const username = event.target.value;
		setSelectedUsername(username);
		const selectedUser = sortedPlayers.find((player) => player.username === username);
		if (selectedUser) {
			onUserSelect(selectedUser);
		}
	};

	return (
		<Box sx={{ textAlign: 'left' }}>
			<Typography sx={{ mx: 1, mt: 1, fontWeight: '600' }}>{t('player')}</Typography>
			<Select
				autoWidth
				size="small"
				sx={betInputSelectSx as SxProps<Theme>}
				labelId="player-username-label"
				id="player-username-select"
				value={selectedUsername}
				onChange={handleSeasonChange}
				MenuProps={betInputPlayerSelectMenuProps(sortedPlayers.length)}
			>
				{sortedPlayers.map((p) => (
							<MenuItem
								sx={
									[
										betInputPlayerMenuItemSx,
										{ pl: 1.5, pb: 0.7, minWidth: '14.5rem' },
									] as SxProps<Theme>
								}
								key={p.id}
								value={p.username}
							>
								<UserAvatar
									player={p}
									height={27}
									sx={{ my: 0, ml: -0.3, fontWeight: 400 }}
									avasx={{ border: 0, mr: 1 }}
								/>
							</MenuItem>
						))}
			</Select>
		</Box>
	);
}
