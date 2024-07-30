import { Avatar, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import User from '../../features/auth/types/User';
import pathToAvatarImage from '../utils/pathToAvatarImage';

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
			<MenuItem key={t('all')} sx={{ ml: -0.5, minWidth: '11rem' }} value={t('all')}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Avatar
						variant="square"
						sx={{ width: 27, height: 27 }}
						alt="league_logo"
						src="/upload/avatars/cool_man.jpg"
					/>

					<Typography sx={{ mx: 1, fontSize: '1rem' }}>{t('all')}</Typography>
				</div>
			</MenuItem>
			{players &&
				players
					.slice()
					.sort((a, b) => (a.username && b.username ? a.username.localeCompare(b.username) : 0))
					.map((p) => (
						<MenuItem key={p.id} sx={{ ml: -1, minWidth: '6.5rem' }} value={p.username}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Avatar
									sx={{ width: 27, height: 27 }}
									alt="user_avatar"
									src={pathToAvatarImage(p.avatar)}
								/>

								<Typography sx={{ mx: 1, fontSize: '1rem' }}>{p.username}</Typography>
							</div>
						</MenuItem>
					))}
		</Select>
	);
};

export default PlayerSelect;
