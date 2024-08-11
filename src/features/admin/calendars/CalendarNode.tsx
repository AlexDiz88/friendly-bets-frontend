import { DoDisturbOn } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { t } from 'i18next';
import pathToLogoImage from '../../../components/utils/pathToLogoImage';
import { MATCHDAY_TITLE_FINAL } from '../../../constants';
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
		<Box
			sx={{
				border: '1px solid #123456DB',
				borderRadius: 2,
				px: 1.5,
				py: 0.5,
				boxShadow: '0 4px 8px #12131BB6',
				bgcolor: '#0008420E',
			}}
		>
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
												sx={{ width: 27, height: 27 }}
												alt="league_logo"
												src={pathToLogoImage(node.leagueCode)}
											/>
											<Typography
												sx={{
													mx: 0.3,
													fontWeight: 600,
													fontFamily: "'Exo 2'",
													color: '#123456',
												}}
											>
												{node.matchDay === MATCHDAY_TITLE_FINAL
													? t(`playoffRound.${node.matchDay}`)
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
				<Box
					sx={{
						color: 'brown',
						fontWeight: 600,
						width: '12rem',
						py: 0.5,
						textAlign: 'center',
					}}
				>
					{t('calendarForLeagueMatchdayNotExist')}
				</Box>
			)}
		</Box>
	);
};

export default CalendarNode;
