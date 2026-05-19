import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getGridColumnsForMatchdayCount } from '../../features/football-data/competitionOptions';

const compactSelectSx = {
	height: 30,
	fontSize: '0.8rem',
	'& .MuiSelect-select': {
		py: 0.25,
		px: 0.75,
		minHeight: 'unset !important',
		lineHeight: 1.2,
	},
};

interface MatchdayGridSelectProps {
	value: number;
	matchdayCount: number;
	onChange: (matchday: number) => void;
	'aria-label'?: string;
}

export default function MatchdayGridSelect({
	value,
	matchdayCount,
	onChange,
	'aria-label': ariaLabel,
}: MatchdayGridSelectProps): JSX.Element {
	const columns = getGridColumnsForMatchdayCount(matchdayCount);
	const matchdays = Array.from({ length: matchdayCount }, (_, i) => i + 1);

	const handleChange = (e: SelectChangeEvent<number>): void => {
		onChange(Number(e.target.value));
	};

	return (
		<Select
			size="small"
			value={value}
			onChange={handleChange}
			aria-label={ariaLabel}
			sx={{ ...compactSelectSx, minWidth: '2.5rem' }}
			MenuProps={{
				PaperProps: { sx: { maxHeight: 360 } },
				MenuListProps: {
					sx: {
						display: 'grid',
						gridTemplateColumns: `repeat(${columns}, 2.1rem)`,
						gap: 0.35,
						p: 0.75,
						justifyContent: 'center',
					},
				},
			}}
		>
			{matchdays.map((md) => (
				<MenuItem
					key={md}
					value={md}
					sx={{
						minWidth: 0,
						width: '2.1rem',
						height: '2.1rem',
						justifyContent: 'center',
						p: 0,
						fontSize: '0.8rem',
						fontWeight: value === md ? 700 : 500,
					}}
				>
					{md}
				</MenuItem>
			))}
		</Select>
	);
}
