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
	compact?: boolean;
}

const compactSelectSx = {
	height: 34,
	fontSize: '0.8rem',
	'& .MuiSelect-select': {
		py: 0.5,
		px: 0.5,
		minHeight: 'unset !important',
		display: 'flex',
		alignItems: 'center',
		lineHeight: 1.2,
	},
};

const LeagueSelect = ({
	value,
	onChange,
	leagues,
	withoutAll,
	fullLeagueNames,
	compact,
}: LeagueSelectProps): JSX.Element => {
	const avatarHeight = compact ? 23: 27;
	const menuMinWidth = compact ? '5.5rem' : '6.5rem';
	const leagueCodes = leagues?.map((l) => l.leagueCode) ?? [];
	const allValue = t('all');
	const safeValue =
		!withoutAll && value === allValue
			? allValue
			: leagueCodes.includes(value)
				? value
				: '';

	return (
		<Select
			autoWidth
			size="small"
			displayEmpty={withoutAll}
			sx={{
				minWidth: fullLeagueNames ? '15rem' : compact ? '6rem' : '7rem',
				maxWidth: compact ? '6rem' : undefined,
				...(compact ? compactSelectSx : {}),
			}}
			labelId="league-label"
			id="league-select"
			value={safeValue}
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
					<MenuItem
						sx={{ minWidth: menuMinWidth, py: compact ? 0.5 : undefined }}
						key={l.id}
						value={l.leagueCode}
					>
						<LeagueAvatar
							leagueCode={l.leagueCode}
							height={avatarHeight}
							sx={{ justifyContent: 'start', mr: compact ? 0.25 : 1, fontSize: compact ? '0.8rem' : undefined }}
							avasx={{ mr: compact ? 0.5 : 1 }}
							fullName={fullLeagueNames}
						/>
					</MenuItem>
				))}
		</Select>
	);
};

export default LeagueSelect;
