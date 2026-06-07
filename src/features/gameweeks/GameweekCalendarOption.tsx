import { Avatar, Box, Typography, type SxProps, type Theme } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import Calendar from '../admin/calendars/types/Calendar';
import { gameweekCalendarDateSx, gameweekCalendarMatchdaySx } from './gameweekPageStyles';

export default function GameweekCalendarOption({ calendar }: { calendar: Calendar }): JSX.Element {
	const { i18n } = useTranslation();

	return (
		<Box sx={{ py: 0.25 }}>
			<Typography sx={gameweekCalendarDateSx}>
				{calendar.startDate ? dayjs(calendar.startDate).format('DD.MM') : ''} –{' '}
				{calendar.endDate ? dayjs(calendar.endDate).format('DD.MM') : ''}
			</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
				{calendar.leagueMatchdayNodes?.map((node, index) => (
					<Box key={`${node.leagueId}-${node.matchDay}-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							variant="square"
							sx={[{ width: 22, height: 22 }, leagueLogoAvatarSx] as SxProps<Theme>}
							alt="league_logo"
							src={pathToLogoImage(node.leagueCode)}
						/>
						<Typography sx={gameweekCalendarMatchdaySx}>
							{matchDayTitleViewTransform(node.matchDay, i18n.language)}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}
