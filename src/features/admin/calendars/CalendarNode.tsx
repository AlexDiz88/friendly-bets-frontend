import { DoDisturbOn } from '@mui/icons-material';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { leagueLogoAvatarSx } from '../../../components/custom/avatar/LeagueAvatar';
import { pathToLogoImage } from '../../../components/utils/imgBase64Converter';
import matchDayTitleViewTransform from '../../../components/utils/matchDayTitleViewTransform';
import {
	calendarNodeBetMetaSx,
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
	const { i18n } = useTranslation();

	return (
		<Box sx={calendarNodeSx}>
			{calendar && (
				<>
					<Box sx={{ fontWeight: 600, mb: 0.5 }}>
						{calendar.startDate ? dayjs(calendar.startDate).format('DD.MM') : ''} -{' '}
						{calendar.endDate ? dayjs(calendar.endDate).format('DD.MM') : ''}
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
						<Box sx={{ flex: 1, minWidth: 0 }}>
							{calendar.leagueMatchdayNodes &&
								calendar.leagueMatchdayNodes.map((node, index) => {
									const matchDayLabel = matchDayTitleViewTransform(
										node.matchDay,
										i18n.language
									);
									const betMetaTooltip = `${t('maxBetsPerMatchday')}: ${node.betCountLimit}, ${t('maxBetSizePerMatchday')}: ${node.defaultBetSize}`;

									return (
										<Box
											key={`${node.leagueId}-${node.matchDay}-${index}`}
											sx={{ mb: index < calendar.leagueMatchdayNodes.length - 1 ? 0.75 : 0 }}
										>
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<Avatar
													variant="square"
													sx={
														[
															{ width: 27, height: 27 },
															leagueLogoAvatarSx,
														] as SxProps<Theme>
													}
													alt="league_logo"
													src={pathToLogoImage(node.leagueCode)}
												/>
												<Typography sx={calendarNodeMatchdayTextSx}>{matchDayLabel}</Typography>
											</Box>
											<Tooltip title={betMetaTooltip}>
												<Typography sx={calendarNodeBetMetaSx}>
													{node.betCountLimit} · {node.defaultBetSize}
												</Typography>
											</Tooltip>
										</Box>
									);
								})}
						</Box>

						{deleteIcon && !calendar.hasBets && (
							<IconButton
								sx={{ mt: -0.5, mr: 0.5, p: 0, color: 'red', scale: '150%', flexShrink: 0 }}
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
