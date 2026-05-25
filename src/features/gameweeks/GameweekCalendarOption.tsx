import { Avatar, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { MATCHDAY_TITLE_FINAL } from '../../constants';
import Calendar from '../admin/calendars/types/Calendar';

export default function GameweekCalendarOption({ calendar }: { calendar: Calendar }): JSX.Element {
	return (
		<Box sx={{ py: 0.25 }}>
			<Typography sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>
				{calendar.startDate ? dayjs(calendar.startDate).format('DD.MM') : ''} –{' '}
				{calendar.endDate ? dayjs(calendar.endDate).format('DD.MM') : ''}
			</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
				{calendar.leagueMatchdayNodes?.map((node, index) => (
					<Box key={`${node.leagueId}-${node.matchDay}-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							variant="square"
							sx={{ width: 22, height: 22 }}
							alt="league_logo"
							src={pathToLogoImage(node.leagueCode)}
						/>
						<Typography
							sx={{
								ml: 0.25,
								fontWeight: 600,
								fontSize: '0.8rem',
								fontFamily: "'Exo 2'",
								color: '#123456',
							}}
						>
							{node.matchDay === MATCHDAY_TITLE_FINAL
								? t(`playoffStage.${node.matchDay}`)
								: node.matchDay}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}
