import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import {
	betInputMenuItemSx,
	betInputSelectMenuProps,
	betInputSelectSx,
} from './betInputFieldStyles';
import Team from '../../features/admin/teams/types/Team';
import TeamAvatar from '../custom/avatar/TeamAvatar';

interface TeamSelectProps {
	label: string;
	value: string;
	onChange: ((event: SelectChangeEvent<string>) => void) | undefined;
	teams: Team[] | undefined;
}

const blurActiveElement = (): void => {
	const active = document.activeElement;
	if (active instanceof HTMLElement) {
		active.blur();
	}
};

const TeamSelect = ({ label, value, onChange, teams }: TeamSelectProps): JSX.Element => {
	const [open, setOpen] = useState(false);

	const sortedTeams = useMemo(
		() =>
			teams
				? [...teams].sort((a, b) =>
						a.title && b.title
							? t(`teams:${a.title}`).localeCompare(t(`teams:${b.title}`))
							: 0
					)
				: [],
		[teams]
	);

	const handleChange = (event: SelectChangeEvent<string>): void => {
		onChange?.(event);
		setOpen(false);
		requestAnimationFrame(blurActiveElement);
	};

	const handleClose = (): void => {
		setOpen(false);
		requestAnimationFrame(blurActiveElement);
	};

	const teamCount = sortedTeams.length;

	return (
		<Box sx={{ textAlign: 'left' }}>
			<Typography sx={{ mx: 1, fontWeight: '600' }}>{t(label)}</Typography>
			<Select
				autoWidth
				size="small"
				open={open}
				onOpen={() => setOpen(true)}
				onClose={handleClose}
				sx={betInputSelectSx as SxProps<Theme>}
				labelId={`${label}-label`}
				id={`${label}-select`}
				value={value}
				onChange={handleChange}
				MenuProps={{
					...betInputSelectMenuProps(teamCount),
					transitionDuration: 0,
					disableScrollLock: true,
					disableAutoFocus: true,
					disableEnforceFocus: true,
					disableRestoreFocus: true,
				}}
			>
				{sortedTeams.map((team) => (
					<MenuItem
						sx={[betInputMenuItemSx, { mx: 0, minWidth: '14.5rem' }] as SxProps<Theme>}
						key={team.id}
						value={team.title}
					>
						<TeamAvatar team={team} sx={{ ml: '1px' }} />
					</MenuItem>
				))}
			</Select>
		</Box>
	);
};

export default TeamSelect;
