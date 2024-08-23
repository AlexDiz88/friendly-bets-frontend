import { GppMaybe } from '@mui/icons-material';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import matchDayTitleViewTransform from '../../components/utils/matchDayTitleViewTransform';
import Bet from './types/Bet';

export default function EmptyBetCard({ bet }: { bet: Bet }): JSX.Element {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;
	const [matchDayTitle, setMatchDayTitle] = useState<string>('');
	const { leagueCode, player, balanceChange, betSize } = bet;

	useEffect(() => {
		setMatchDayTitle(matchDayTitleViewTransform(bet.matchDay, currentLanguage));
	}, [bet, currentLanguage]);

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
						bgcolor: '#e0dfe4',
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
						<UserAvatar player={player} />
						<LeagueAvatar leagueCode={leagueCode} matchDay={matchDayTitle} />
					</Box>
					<Box sx={{ textAlign: 'left', ml: 0.5 }}>
						<b>{t('amount')}:</b> {betSize}
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
								<GppMaybe sx={{ color: '#8f2323' }} />
								{t('betNotPlaced')}
							</Box>
						</Box>
						{balanceChange !== undefined && (
							<Box sx={{ pr: 1, fontWeight: 600, fontSize: '1.4rem', color: 'brown' }}>
								{balanceChange}€
							</Box>
						)}
					</Box>
				</Box>
			)}
		</>
	);
}
