import { Avatar, Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import User from '../../features/auth/types/User';
import UserAvatar from '../custom/avatar/UserAvatar';

interface PlayerSelectProps {
	value: string;
	onChange: ((event: SelectChangeEvent<string>) => void) | undefined;
	players: User[] | undefined;
}

const PlayerSelect = ({ value, onChange, players }: PlayerSelectProps): JSX.Element => {
	return (
		<Select
			autoWidth
			size="small"
			sx={{ minWidth: '11.5rem', ml: 0.5 }}
			labelId="player-title-label"
			id="player-title-select"
			value={value}
			onChange={onChange}
		>
			<MenuItem key={t('all')} sx={{ ml: -0.5, mb: 0.5, minWidth: '11rem' }} value={t('all')}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Avatar
						variant="square"
						sx={{ height: 27, width: 27 }}
						alt="all_players_logo"
						src="/upload/avatars/cool_man.jpg"
					/>

					<Typography sx={{ mx: 1, fontSize: '1rem' }}>{t('all')}</Typography>
				</Box>
			</MenuItem>
			{players &&
				players
					.slice()
					.sort((a, b) => (a.username && b.username ? a.username.localeCompare(b.username) : 0))
					.map((p) => (
						<MenuItem key={p.id} sx={{ ml: -1, mb: 0.5, minWidth: '6.5rem' }} value={p.username}>
							<UserAvatar
								player={p}
								height={27}
								sx={{ my: 0, fontWeight: 400 }}
								avasx={{ border: 0, mr: 1 }}
							/>
						</MenuItem>
					))}
		</Select>
	);
};

export default PlayerSelect;
