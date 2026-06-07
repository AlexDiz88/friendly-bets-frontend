import { Avatar, Box, MenuItem, Select, SelectChangeEvent, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { useMemo } from 'react';
import User from '../../features/auth/types/User';
import UserAvatar from '../custom/avatar/UserAvatar';
import {
	filterSelectAllAvatarSx,
	filterSelectAllLabelSx,
	filterSelectPlayerMenuItemSx,
	filterSelectPlayerMenuProps,
	filterSelectPlayerLayoutSx,
	filterSelectRootSx,
} from './filterSelectStyles';
import { sortPlayersForSelect } from './sortPlayersForSelect';

interface PlayerSelectProps {
	value: string;
	onChange: ((event: SelectChangeEvent<string>) => void) | undefined;
	players: User[] | undefined;
}

const PlayerSelect = ({ value, onChange, players }: PlayerSelectProps): JSX.Element => {
	const sortedPlayers = useMemo(
		() => (players ? sortPlayersForSelect(players) : []),
		[players]
	);
	const menuItemCount = 1 + sortedPlayers.length;

	return (
		<Select
			size="small"
			sx={
				[
					filterSelectRootSx('standard'),
					filterSelectPlayerLayoutSx,
					{ minWidth: { xs: 0, sm: '10rem' } },
				] as SxProps<Theme>
			}
			labelId="player-title-label"
			id="player-title-select"
			value={value}
			onChange={onChange}
			MenuProps={filterSelectPlayerMenuProps(menuItemCount)}
		>
			<MenuItem sx={filterSelectPlayerMenuItemSx} value={t('all')}>
				<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
					<Avatar
						variant="circular"
						sx={filterSelectAllAvatarSx}
						alt="all_players_logo"
						src={`${import.meta.env.PUBLIC_URL || ''}/upload/avatars/cool_man.jpg`}
					/>
					<Box component="span" sx={[filterSelectAllLabelSx, { ml: 0.5, mr: 0 }] as SxProps<Theme>}>
						{t('all')}
					</Box>
				</Box>
			</MenuItem>
			{sortedPlayers.map((p) => (
						<MenuItem
							key={p.id}
							sx={filterSelectPlayerMenuItemSx}
							value={p.username}
						>
							<UserAvatar
								player={p}
								height={28}
								sx={{ my: 0, mb: 0, ml: 0, fontWeight: 500, fontSize: '0.875rem' }}
								avasx={{ border: 0, mr: 0.75, height: 28, width: 28 }}
							/>
						</MenuItem>
					))}
		</Select>
	);
};

export default PlayerSelect;
