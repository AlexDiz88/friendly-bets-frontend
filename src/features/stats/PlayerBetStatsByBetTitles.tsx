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
import { memo, useCallback, useMemo, useState } from 'react';
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import User from '../auth/types/User';
import {
	CategoryStats,
	PlayerStatsByBetTitles,
	SubCategoryStats,
} from './types/PlayerStatsByBetTitles';

/** MUI по умолчанию увеличивает margin content на 8px в expanded — фиксируем высоту заголовка. */
const playerAccordionSummarySx = {
	px: 2,
	minHeight: 56,
	'&.Mui-expanded': {
		minHeight: 56,
	},
	'& .MuiAccordionSummary-content': {
		my: 0,
		alignItems: 'center',
	},
	'& .MuiAccordionSummary-content.Mui-expanded': {
		my: 0,
	},
};

const SubcategoryCard = memo(function SubcategoryCard({ sub }: { sub: SubCategoryStats }): JSX.Element {
	return (
		<Box
			sx={{
				minWidth: '200px',
				background: '#064B60FF',
				color: '#C0EEF5FF',
				boxShadow: '0 0 10px #000D39FF',
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
});

const SubCategoryRow = memo(function SubCategoryRow({ sub }: { sub: SubCategoryStats }): JSX.Element {
	const [open, setOpen] = useState(false);

	return (
		<Box sx={{ mb: 0.5 }}>
			<Box
				onClick={() => setOpen((prev) => !prev)}
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					cursor: 'pointer',
					background: '#093654FF',
					color: '#C6D8DAFF',
					px: 2,
					minHeight: 48,
					borderRadius: 1,
					outline: 'none',
					WebkitTapHighlightColor: 'transparent',
					userSelect: 'none',
				}}
			>
				<Box sx={{ display: 'flex' }}>
					<ExpandMoreIcon
						sx={{
							ml: -1,
							transform: open ? 'rotate(180deg)' : 'none',
							transition: 'transform 180ms',
						}}
					/>
					<Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
						{t(`betTitleSubCategory.${sub.subCategory}`)}{' '}
						<Typography
							sx={{ ml: 0.5, color: '#68F5FFFF', fontSize: '0.9rem', fontWeight: 600 }}
						>
							[{sub.betCount}]
						</Typography>
					</Box>
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
					{sub.actualBalance.toFixed(2)} €
				</Typography>
			</Box>

			<Collapse in={open} timeout={180} unmountOnExit>
				<Box sx={{ p: 0.5 }}>
					<SubcategoryCard sub={sub} />
				</Box>
			</Collapse>
		</Box>
	);
});

const CategoryCard = memo(function CategoryCard({
	betTitleCategoryStats,
}: {
	betTitleCategoryStats: CategoryStats;
}): JSX.Element {
	const [open, setOpen] = useState(false);

	const summary = betTitleCategoryStats.stats.find((sub) => sub.subCategory === 'SUMMARY');
	const subCategories = useMemo(
		() => betTitleCategoryStats.stats.filter((s) => s.subCategory !== 'SUMMARY'),
		[betTitleCategoryStats.stats]
	);

	return (
		<Card
			sx={{
				background: 'linear-gradient(135deg, #082935FF, #106D6DFF)',
				color: '#e6e9d1',
				p: 1.5,
				border: 1,
			}}
		>
			<Box
				onClick={() => setOpen((prev) => !prev)}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					cursor: 'pointer',
					outline: 'none',
					WebkitTapHighlightColor: 'transparent',
					userSelect: 'none',
				}}
			>
				<Box sx={{ display: 'flex' }}>
					<ExpandMoreIcon
						sx={{
							transform: open ? 'rotate(180deg)' : 'none',
							transition: 'transform 180ms',
						}}
					/>
					<Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
						{t(`betTitleCategory.${betTitleCategoryStats.category}`)}
						<Typography sx={{ color: '#FFDC7BFF', ml: 0.5, fontWeight: 600 }}>
							[{betTitleCategoryStats.stats.reduce((total, s) => total + s.betCount, 0) / 2}]
						</Typography>
					</Box>
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
			<Collapse in={open} timeout={180} unmountOnExit>
				<Box sx={{ mt: 2 }}>
					{subCategories.map((sub) => (
						<SubCategoryRow key={sub.subCategory} sub={sub} />
					))}
				</Box>
			</Collapse>
		</Card>
	);
});

const PlayerStatsAccordion = memo(function PlayerStatsAccordion({
	playerStats,
	player,
}: {
	playerStats: PlayerStatsByBetTitles;
	player: User;
}): JSX.Element {
	const [expanded, setExpanded] = useState(false);

	const handleChange = useCallback((_event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded);
	}, []);

	return (
		<Accordion
			expanded={expanded}
			onChange={handleChange}
			disableGutters
			sx={{
				background: 'linear-gradient(135deg, #061744FF 0%, #267A9EFF 100%)',
				color: '#ffffff',
				'&:before': { display: 'none' },
			}}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
				sx={playerAccordionSummarySx}
			>
				<Box display="flex" alignItems="center" gap={2}>
					<Avatar src={avatarBase64Converter(player.avatar)} />
					<Typography fontWeight={700}>{player.username}</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails sx={{ pt: 0 }}>
				{playerStats.betTitleCategoryStats.map((stats) => (
					<CategoryCard key={stats.category} betTitleCategoryStats={stats} />
				))}
			</AccordionDetails>
		</Accordion>
	);
});

interface Props {
	playersStatsByBetTitles: PlayerStatsByBetTitles[];
	players: User[];
}

export default function PlayerBetStatsByBetTitles({
	playersStatsByBetTitles,
	players,
}: Props): JSX.Element {
	const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

	const sortedRows = useMemo(
		() =>
			playersStatsByBetTitles
				.slice()
				.sort((a, b) => b.actualBalance - a.actualBalance)
				.flatMap((playerStats) => {
					const player = playersById.get(playerStats.userId);
					if (!player) {
						return [];
					}
					return [{ playerStats, player }];
				}),
		[playersStatsByBetTitles, playersById]
	);

	return (
		<Box sx={{ width: '100%' }}>
			{sortedRows.map(({ playerStats, player }) => (
				<PlayerStatsAccordion
					key={playerStats.userId}
					playerStats={playerStats}
					player={player}
				/>
			))}
		</Box>
	);
}
