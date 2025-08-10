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
				background: '#0B2100FF',
				color: '#E2F1CFFF',
				boxShadow: '0 0 12px #3b7d00cc',
				border: 1,
				p: 2,
				borderRadius: 3,
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
				fontSize="1rem"
				sx={{
					color:
						sub.actualBalance == 0 ? '#ffffff' : sub.actualBalance > 0 ? '#4ade80' : '#F94B4BFF',
				}}
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
	// Храним состояние раскрытия подкатегорий в объекте, где ключ — subCategory
	const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});

	const toggleSub = (subCategory: string): void => {
		setOpenSubs((prev) => ({
			...prev,
			[subCategory]: !prev[subCategory],
		}));
	};

	const summary = betTitleCategoryStats.stats.find((sub) => sub.subCategory === 'SUMMARY');

	return (
		<Card
			sx={{
				background: 'linear-gradient(135deg, #1c2e07, #3b5410)',
				color: '#e6e9d1',
				p: 1.5,
				border: 1,
			}}
		>
			<Box
				onClick={() => setOpen(!open)}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					cursor: 'pointer',
					outline: 'none', // убирает контур при фокусе
					WebkitTapHighlightColor: 'transparent', // убирает подсветку при тапе на мобильных
					userSelect: 'none',
				}}
			>
				<Box sx={{ display: 'flex' }}>
					<ExpandMoreIcon
						sx={{
							color: '#ffffff',
							transform: open ? 'rotate(180deg)' : 'none',
							transition: '0.3s',
						}}
					/>
					<Typography fontWeight={700}>
						{t(`betTitleCategory.${betTitleCategoryStats.category}`)}
					</Typography>
				</Box>
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
						textShadow: '0 0 4px rgba(0,0,0,1)',
					}}
				>
					{summary?.actualBalance.toFixed(2)} €
				</Typography>
			</Box>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box sx={{ mt: 2 }}>
					{betTitleCategoryStats.stats
						.filter((subCategoryStats) => subCategoryStats.subCategory !== 'SUMMARY')
						.map((sub) => (
							<Accordion key={sub.subCategory} expanded={!!openSubs[sub.subCategory]}>
								<Box
									onClick={() => toggleSub(sub.subCategory)}
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										cursor: 'pointer',
										background: '#42610eff',
										color: '#d9f0b4',
										px: 2,
										minHeight: 48,
										borderRadius: 1,
										outline: 'none', // убирает контур при фокусе
										WebkitTapHighlightColor: 'transparent', // убирает подсветку при тапе на мобильных
										userSelect: 'none',
									}}
								>
									<Box sx={{ display: 'flex' }}>
										<ExpandMoreIcon
											sx={{
												ml: -1,
												color: '#ffffff',
												transform: openSubs[sub.subCategory] ? 'rotate(180deg)' : 'none',
												transition: '0.3s',
											}}
										/>
										<Typography fontWeight={700}>
											{t(`betTitleSubCategory.${sub.subCategory}`)}
										</Typography>
									</Box>

									<Typography
										sx={{
											fontSize: '0.8rem',
											fontWeight: 600,
											color:
												sub.actualBalance == null
													? '#ffffff'
													: sub.actualBalance > 0
													? '#a6f24d'
													: sub.actualBalance < 0
													? '#f96e6eff'
													: '#ffffff',
											textShadow: '0 0 4px rgba(0,0,0,1)',
										}}
									>
										{sub?.actualBalance.toFixed(2)} €
									</Typography>
								</Box>

								<AccordionDetails sx={{ p: 0.5 }}>
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
		<Box sx={{ width: '100%' }}>
			{playersStatsByBetTitles
				.slice()
				.sort((a, b) => b.actualBalance - a.actualBalance)
				.map((playerStats) => {
					const player = players?.find((p) => p.id === playerStats.userId);
					if (!player) return null;

					return (
						<Accordion
							key={playerStats.userId}
							sx={{
								background: 'linear-gradient(135deg, #2b4d19ff 0%, #269e3eff 100%)',
								color: '#ffffff',
							}}
						>
							<AccordionSummary disableRipple expandIcon={null} sx={{ px: 2 }}>
								<Box display="flex" alignItems="center" gap={2}>
									<ExpandMoreIcon sx={{ color: '#ffffff' }} />
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
