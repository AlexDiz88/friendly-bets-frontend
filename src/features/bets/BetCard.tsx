import { Avatar, Box } from '@mui/material';
import Bet from './types/Bet';
import pathToAvatarImage from '../../components/utils/pathToAvatarImage';
import pathToLogoImage from '../../components/utils/pathToLogoImage';

export default function BetCard({ bet }: { bet: Bet }): JSX.Element {
	const {
		leagueShortNameEn,
		leagueShortNameRu,
		player,
		homeTeam,
		awayTeam,
		betTitle,
		betOdds,
		betSize,
		matchDay,
	} = bet;

	return (
		<>
			{bet && (
				<Box
					sx={{
						maxWidth: '25rem',
						minWidth: '19rem',
						border: 2,
						mx: 0.5,
						mb: 1.5,
						p: 0.5,
						borderRadius: 2,
						bgcolor: 'white',
						boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ mb: 0.8, ml: 0.5, display: 'flex', alignItems: 'center' }}>
							<Avatar
								sx={{ mr: 0.5, width: 40, height: 40, border: 1, borderColor: 'gray' }}
								alt="user_avatar"
								src={pathToAvatarImage(player.avatar)}
							/>
							<b>{player.username}</b>
						</Box>
						<Box
							sx={{
								mr: 1,
								display: 'flex',
								alignItems: 'start',
							}}
						>
							<Avatar
								sx={{ mr: 0.5, width: 'auto', height: 25 }}
								alt="team_logo"
								src={pathToLogoImage(leagueShortNameEn)}
							/>
							{leagueShortNameRu} -{' '}
							{matchDay.startsWith('1/') || matchDay === 'Финал' ? matchDay : matchDay + 'й'}
						</Box>
					</Box>
					<Box sx={{ fontSize: '0.9rem' }}>
						<Box style={{ display: 'flex', alignItems: 'center' }}>
							<Avatar
								sx={{ mr: 0.5, width: 25, height: 25 }}
								alt="team_logo"
								src={pathToLogoImage(homeTeam.fullTitleEn)}
							/>
							{homeTeam.fullTitleRu}
							<Avatar
								sx={{ mr: 0.5, ml: 1, width: 25, height: 25 }}
								alt="team_logo"
								src={pathToLogoImage(awayTeam.fullTitleEn)}
							/>
							{awayTeam.fullTitleRu}
						</Box>
					</Box>
					<Box sx={{ textAlign: 'left', ml: 0.5 }}>
						<b>Ставка:</b> {betTitle}
					</Box>
					<Box sx={{ textAlign: 'left', ml: 0.5 }}>
						<b>Кэф:</b> {betOdds.toFixed(2)}, <b>Сумма:</b> {betSize}
					</Box>
				</Box>
			)}
		</>
	);
}
