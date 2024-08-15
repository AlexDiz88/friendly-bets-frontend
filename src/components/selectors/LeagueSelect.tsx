import { Avatar, Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import League from '../../features/admin/leagues/types/League';
import LeagueAvatar from '../custom/avatar/LeagueAvatar';

interface LeagueSelectProps {
	value: string;
	onChange: ((event: SelectChangeEvent<string>) => void) | undefined;
	leagues: League[] | undefined;
	withoutAll?: boolean;
	fullLeagueNames?: boolean;
}

const LeagueSelect = ({
	value,
	onChange,
	leagues,
	withoutAll,
	fullLeagueNames,
}: LeagueSelectProps): JSX.Element => {
	return (
		<Select
			autoWidth
			size="small"
			sx={{ minWidth: fullLeagueNames ? '15rem' : '7rem', ml: -0.2 }}
			labelId="league-label"
			id="league-select"
			value={value}
			onChange={onChange}
		>
			{!withoutAll && (
				<MenuItem key={t('all')} sx={{ ml: -0.5, minWidth: '6.5rem' }} value={t('all')}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							variant="square"
							sx={{ width: 27, height: 27 }}
							alt="league_logo"
							// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
							src={`${import.meta.env.PUBLIC_URL || ''}/upload/logo/total.png`}
						/>

						<Typography sx={{ mx: 1, fontSize: '1rem' }}>{t('all')}</Typography>
					</Box>
				</MenuItem>
			)}

			{leagues &&
				leagues.map((l) => (
					<MenuItem sx={{ ml: -0.5, minWidth: '6.5rem' }} key={l.id} value={l.leagueCode}>
						<LeagueAvatar
							leagueCode={l.leagueCode}
							sx={{ justifyContent: 'start' }}
							avasx={{ mr: 1 }}
							fullName={fullLeagueNames}
						/>
					</MenuItem>
				))}
		</Select>
	);
};

export default LeagueSelect;
