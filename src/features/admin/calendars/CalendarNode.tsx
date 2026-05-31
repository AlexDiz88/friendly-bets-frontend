import { DoDisturbOn } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { leagueLogoAvatarSx } from '../../../components/custom/avatar/LeagueAvatar';
import { pathToLogoImage } from '../../../components/utils/imgBase64Converter';
import { MATCHDAY_TITLE_FINAL } from '../../../constants';
import {
	calendarNodeMatchdayTextSx,
	calendarNodeNoCalendarSx,
	calendarNodeSx,
} from './calendarNodeStyles';
import Calendar from './types/Calendar';

const CalendarNode = ({
	calendar,
	onClick,
	deleteIcon = false,
	noCalendar = false,
}: {
	calendar?: Calendar;
	onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
	deleteIcon?: boolean;
	noCalendar?: boolean;
}): JSX.Element => {
	return (
		<Box sx={calendarNodeSx}>
			{calendar && (
				<>
					<Box sx={{ fontWeight: 600, mb: 0.5 }}>
						{calendar.startDate ? dayjs(calendar.startDate).format('DD.MM') : ''} -{' '}
						{calendar.endDate ? dayjs(calendar.endDate).format('DD.MM') : ''}
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							{calendar.leagueMatchdayNodes &&
								calendar.leagueMatchdayNodes.map((node, index) => (
									<Box key={index}>
										<Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
											<Avatar
												variant="square"
												sx={
													[{ width: 27, height: 27 }, leagueLogoAvatarSx] as SxProps<Theme>
												}
												alt="league_logo"
												src={pathToLogoImage(node.leagueCode)}
											/>
											<Typography sx={calendarNodeMatchdayTextSx}>
												{node.matchDay === MATCHDAY_TITLE_FINAL
													? t(`playoffStage.${node.matchDay}`)
													: node.matchDay}
											</Typography>
										</Box>
									</Box>
								))}
						</Box>

						{deleteIcon && !calendar.hasBets && (
							<IconButton
								sx={{ mt: -3, mr: 1, p: 0, color: 'red', scale: '150%' }}
								onClick={onClick}
							>
								<DoDisturbOn />
							</IconButton>
						)}
					</Box>
				</>
			)}

			{!calendar && noCalendar && (
				<Box sx={calendarNodeNoCalendarSx}>
					{t('calendarForLeagueMatchdayNotExist')}
				</Box>
			)}
		</Box>
	);
};

export default CalendarNode;
