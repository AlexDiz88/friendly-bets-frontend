import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Card,
	Collapse,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import { selectActiveSeason } from '../admin/seasons/selectors';
import {
	CategoryStats,
	PlayerStatsByBetTitles,
	SubCategoryStats,
} from './types/PlayerStatsByBetTitles';

function SubcategoryCard({ sub }: { sub: SubCategoryStats }): JSX.Element {
	return (
		<Box
			sx={{
				minWidth: '200px',
				p: 2,
				borderRadius: 3,
				bgcolor: '#32353AFF',
				color: '#F7F9F1FF',
				boxShadow: '0 0 10px #38bdf8',
				mb: 1.5,
				fontWeight: 600,
			}}
		>
			<Typography fontSize="0.9rem">
				{t('totalBets')}: <b>{sub.betCount}</b>
			</Typography>
			<Typography fontSize="0.9rem">
				{t('betsWonCount')}: <b>{sub.wonBetCount}</b>
			</Typography>
			<Typography fontSize="0.9rem">
				{t('returned')}: <b>{sub.returnedBetCount}</b>
			</Typography>
			<Typography fontSize="0.9rem">
				{t('lost')}: <b>{sub.lostBetCount}</b>
			</Typography>
			<Typography fontSize="0.9rem">
				{t('winPercentage')}: <b>{sub.winRate.toFixed(1)}%</b>
			</Typography>
			<Typography fontSize="0.9rem">
				{t('averageCoef')}: <b>{sub.averageOdds.toFixed(2)}</b>
			</Typography>
			<Typography fontSize="0.9rem">
				{t('averageWinCoef')}: <b>{sub.averageWonBetOdds.toFixed(2)}</b>
			</Typography>
			<Typography
				fontSize="0.9rem"
				sx={{ color: sub.actualBalance >= 0 ? '#4ade80' : '#F94B4BFF' }}
			>
				{t('balance')}: <b>{sub.actualBalance.toFixed(2)}€</b>
			</Typography>
		</Box>
	);
}

function CategoryCard({
	betTitleCategoryStats,
}: {
	betTitleCategoryStats: CategoryStats;
}): JSX.Element {
	const [open, setOpen] = useState(false);
	const summary = betTitleCategoryStats.stats.find((sub) => sub.subCategory === 'SUMMARY');

	return (
		<Card
			sx={{
				bgcolor: '#273244FF',
				color: 'white',
				p: 2,
				border: '1px solid white',
				borderRadius: 3,
			}}
		>
			<Box
				onClick={() => setOpen(!open)}
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				sx={{ cursor: 'pointer' }}
			>
				<Box sx={{ display: 'flex' }}>
					<ExpandMoreIcon
						sx={{
							color: '#38bdf8',
							transform: open ? 'rotate(180deg)' : 'none',
							transition: '0.3s',
						}}
					/>
					<Typography fontWeight={700}>
						{t(`betTitleCategory.${betTitleCategoryStats.category}`)}
					</Typography>
				</Box>
				<Box>
					<Typography
						sx={{
							fontWeight: 600,
							color:
								summary?.actualBalance == null
									? '#ffffff'
									: summary.actualBalance > 0
									? '#4ade80'
									: summary.actualBalance < 0
									? '#F94B4BFF'
									: '#ffffff',
						}}
					>
						{summary?.actualBalance.toFixed(2)} €
					</Typography>
				</Box>
			</Box>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box sx={{ mt: 2 }}>
					{betTitleCategoryStats.stats
						.filter((subCategoryStats) => subCategoryStats.subCategory !== 'SUMMARY')
						.map((sub) => (
							<Accordion
								key={sub.subCategory}
								sx={{
									bgcolor: '#0f172a',
									color: '#f1f5f9',
									mb: 1,
									borderRadius: 2,
									boxShadow: '0 0 10px #38bdf8',
									'&::before': { display: 'none' },
								}}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon sx={{ color: '#38bdf8' }} />}
									sx={{
										px: 2,
										minHeight: 48,
									}}
								>
									<Typography fontWeight={700}>
										{t(`betTitleSubCategory.${sub.subCategory}`)}
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={{ px: 2, pt: 0 }}>
									<SubcategoryCard sub={sub} />
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Collapse>
		</Card>
	);
}

interface Props {
	playersStatsByBetTitles: PlayerStatsByBetTitles[];
}

export default function PlayerBetStatsByBetTitles({ playersStatsByBetTitles }: Props): JSX.Element {
	const activeSeason = useAppSelector(selectActiveSeason);
	const players = activeSeason?.players;

	return (
		<Box sx={{ width: '100%', mt: 2 }}>
			{playersStatsByBetTitles.map((playerStats) => {
				const player = players?.find((p) => p.id === playerStats.userId);
				if (!player) return null;

				return (
					<Accordion key={playerStats.userId} sx={{ bgcolor: '#18264BFF', color: '#f1f5f9' }}>
						<AccordionSummary expandIcon={null} sx={{ px: 2 }}>
							<Box display="flex" alignItems="center" gap={2}>
								<ExpandMoreIcon sx={{ color: '#FFFFFFFF' }} />
								<Avatar src={avatarBase64Converter(player.avatar)} />
								<Box>
									<Typography fontWeight={700}>{player.username}</Typography>
								</Box>
							</Box>
						</AccordionSummary>
						<AccordionDetails>
							{playerStats.betTitleCategoryStats.map((stats) => (
								<CategoryCard key={stats.category} betTitleCategoryStats={stats} />
							))}
						</AccordionDetails>
					</Accordion>
				);
			})}
		</Box>
	);
}
