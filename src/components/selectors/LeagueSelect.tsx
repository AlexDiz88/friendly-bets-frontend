import { Avatar, Box, MenuItem, Select, SelectChangeEvent, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import League from '../../features/admin/leagues/types/League';
import LeagueAvatar, { leagueLogoAvatarSx } from '../custom/avatar/LeagueAvatar';
import { compactLeagueSelectSx } from './compactSelectSx';
import {
	filterSelectAllAvatarSx,
	filterSelectAllLabelSx,
	filterSelectLeagueLayoutSx,
	filterSelectMenuItemSx,
	blurFilterSelectOnMenuClose,
	filterSelectMenuProps,
	filterSelectRootSx,
} from './filterSelectStyles';

interface LeagueSelectProps {
	value: string;
	onChange: ((event: SelectChangeEvent<string>) => void) | undefined;
	leagues: League[] | undefined;
	withoutAll?: boolean;
	fullLeagueNames?: boolean;
	compact?: boolean;
}

const LeagueSelect = ({
	value,
	onChange,
	leagues,
	withoutAll,
	fullLeagueNames,
	compact,
}: LeagueSelectProps): JSX.Element => {
	const avatarHeight = compact ? 23 : 27;
	const menuMinWidth = compact ? '5.5rem' : '6.5rem';
	const leagueCodes = leagues?.map((l) => l.leagueCode) ?? [];
	const allValue = t('all');
	const safeValue =
		!withoutAll && value === allValue
			? allValue
			: leagueCodes.includes(value)
				? value
				: '';

	const rootSx: SxProps<Theme> = (
		compact
			? compactLeagueSelectSx
			: [
					filterSelectRootSx('standard'),
					filterSelectLeagueLayoutSx,
					fullLeagueNames
						? { minWidth: '15rem', maxWidth: '100%', flex: '1 1 auto' }
						: { minWidth: '7rem' },
				]
	) as SxProps<Theme>;

	const menuItemCount = (withoutAll ? 0 : 1) + (leagues?.length ?? 0);

	return (
		<Select
			autoWidth
			size="small"
			displayEmpty={withoutAll}
			sx={rootSx}
			labelId="league-label"
			id="league-select"
			value={safeValue}
			onChange={onChange}
			onClose={blurFilterSelectOnMenuClose}
			MenuProps={filterSelectMenuProps(menuItemCount)}
		>
			{!withoutAll && (
				<MenuItem sx={filterSelectMenuItemSx} value={allValue}>
					<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
						<Avatar
							variant="square"
							sx={[filterSelectAllAvatarSx, leagueLogoAvatarSx] as SxProps<Theme>}
							alt="league_logo"
							src={`${import.meta.env.PUBLIC_URL || ''}/upload/logo/total.png`}
						/>
						<Box component="span" sx={filterSelectAllLabelSx}>
							{t('all')}
						</Box>
					</Box>
				</MenuItem>
			)}

			{leagues &&
				leagues.map((l) => (
					<MenuItem
						sx={[filterSelectMenuItemSx, { minWidth: menuMinWidth }] as SxProps<Theme>}
						key={l.id}
						value={l.leagueCode}
					>
						<LeagueAvatar
							leagueCode={l.leagueCode}
							height={avatarHeight}
							sx={{
								justifyContent: 'start',
								mr: compact ? 0.25 : 0.5,
								mb: 0,
								fontSize: compact ? '0.8rem' : '0.875rem',
							}}
							avasx={{ mr: compact ? 0.5 : 0.75 }}
							fullName={fullLeagueNames}
						/>
					</MenuItem>
				))}
		</Select>
	);
};

export default LeagueSelect;
