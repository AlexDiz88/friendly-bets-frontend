import { GppBad, GppGood, RestorePage } from '@mui/icons-material';
import { Avatar, Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import MatchDayTitleTransform from '../../components/utils/MatchDayTitleTransform';
import pathToAvatarImage from '../../components/utils/pathToAvatarImage';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import Bet from './types/Bet';

export default function CompleteBetCard({ bet }: { bet: Bet }): JSX.Element {
	const [matchDayTitle, setMatchDayTitle] = useState<string>('');

	useEffect(() => {
		setMatchDayTitle(
			MatchDayTitleTransform({
				isPlayoff: bet.isPlayoff,
				matchDay: bet.matchDay,
				playoffRound: bet.playoffRound,
			})
		);
	}, [bet]);

	const {
		leagueCode,
		player,
		homeTeam,
		awayTeam,
		betTitle,
		betOdds,
		betSize,
		gameResult,
		betStatus,
		balanceChange,
	} = bet;

	return (
		<Box
			sx={{
				maxWidth: '25rem',
				minWidth: '19rem',
				border: 2,
				mx: 0.5,
				mb: 1.5,
				p: 0.5,
				borderRadius: 2,
				bgcolor: betStatus === 'WON' ? '#daf3db' : betStatus === 'RETURNED' ? '#f8f9d6' : '#f3dada',
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
				<Box sx={{ mr: 1, display: 'flex', alignItems: 'start' }}>
					<Avatar
						sx={{ mr: 0.5, width: 25, height: 25 }}
						alt="team_logo"
						src={pathToLogoImage(leagueCode)}
					/>
					{t(`leagueShortName.${leagueCode}`)}-{matchDayTitle}
				</Box>
			</Box>
			<Box sx={{ fontSize: '0.9rem' }}>
				<Box style={{ display: 'flex', justifyContent: 'center' }}>
					<Avatar
						sx={{ mr: 0.5, width: 25, height: 25 }}
						alt="team_logo"
						src={pathToLogoImage(homeTeam.title)}
					/>
					{t(`teams:${homeTeam.title}`)}
					<Avatar
						sx={{ mr: 0.5, ml: 1, width: 25, height: 25 }}
						alt="team_logo"
						src={pathToLogoImage(awayTeam.title)}
					/>
					{t(`teams:${awayTeam.title}`)}
				</Box>
			</Box>
			<Box sx={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 600 }}>{gameResult}</Box>
			<Box sx={{ textAlign: 'left', ml: 0.5 }}>
				<b>{t('bet')}:</b> {betTitle}
			</Box>
			<Box sx={{ textAlign: 'left', ml: 0.5 }}>
				<b>{t('coef')}:</b> {betOdds.toFixed(2)}, <b>{t('amount')}:</b> {betSize}
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Box>
					<Box
						sx={{
							fontSize: '0.85rem',
							fontWeight: 600,
							pl: 0.5,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{betStatus === 'WON' ? (
							<GppGood sx={{ color: 'green' }} />
						) : betStatus === 'RETURNED' ? (
							<RestorePage sx={{ color: '#b89e00' }} />
						) : (
							<GppBad sx={{ color: '#bd0000' }} />
						)}

						{betStatus === 'WON'
							? t('betWon')
							: betStatus === 'RETURNED'
							? t('betReturned')
							: t('betLost')}
					</Box>
				</Box>
				{balanceChange !== undefined && (
					<Box
						sx={{
							pr: 1,
							fontWeight: 600,
							fontSize: '1.4rem',
							color: balanceChange > 0 ? 'green' : balanceChange < 0 ? 'brown' : 'black',
						}}
					>
						{Number.isInteger(balanceChange) ? balanceChange : balanceChange.toFixed(2)}€
					</Box>
				)}
			</Box>
		</Box>
	);
}
