import { Avatar, Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import pathToLogoImage from '../../../components/utils/pathToLogoImage';
import Team from './types/Team';

interface TeamSelectProps {
	label: string;
	value: string;
	onChange: ((event: SelectChangeEvent<string>) => void) | undefined;
	teams: Team[] | undefined;
}

const TeamSelect = ({ label, value, onChange, teams }: TeamSelectProps): JSX.Element => (
	<Box sx={{ textAlign: 'left' }}>
		<Typography sx={{ mx: 1, fontWeight: '600' }}>{t(label)}</Typography>
		<Select
			autoWidth
			size="small"
			sx={{ minWidth: '15rem', mb: 1 }}
			labelId={`${label}-label`}
			id={`${label}-select`}
			value={value}
			onChange={onChange}
		>
			{teams &&
				teams
					.slice()
					.sort((a, b) =>
						a.title && b.title ? t(`teams:${a.title}`).localeCompare(t(`teams:${b.title}`)) : 0
					)
					.map((team) => (
						<MenuItem sx={{ mx: 0, minWidth: '14.5rem' }} key={team.id} value={team.title}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Avatar
									sx={{ width: 27, height: 27 }}
									alt="team_logo"
									src={pathToLogoImage(team.title)}
								/>
								<Typography sx={{ mx: 1, fontSize: '1rem' }}>{t(`teams:${team.title}`)}</Typography>
							</Box>
						</MenuItem>
					))}
		</Select>
	</Box>
);

export default TeamSelect;
