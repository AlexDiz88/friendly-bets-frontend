import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { OddsMarketGroup } from './oddsTypes';
import BetTitle from '../../features/bets/types/BetTitle';
import { formatPickOdds } from './formatPickOdds';
import {
	oddsPickAccordionDetailsSx,
	oddsPickAccordionSummarySx,
	oddsPickAccordionSx,
	oddsPickRowLabelSx,
	oddsPickRowOddsSx,
	oddsPickRowSx,
	oddsPickSubAccordionDetailsSx,
	oddsPickSubAccordionSummarySx,
	oddsPickSubAccordionSx,
} from './oddsPickDialogStyles';

const LINE_COLUMN_CATEGORIES = new Set([
	'HANDICAP',
	'PERIOD_HANDICAP',
	'TOTALS',
	'TEAM_TOTAL_HOME',
	'TEAM_TOTAL_AWAY',
]);

function rowReactKey(row: OddsMarketGroup['rows'][number]): string {
	if (row.selectionKey) {
		return row.selectionKey;
	}
	const bet = row.betTitle;
	const betPart =
		bet != null ? `${bet.code}:${bet.isNot ? '1' : '0'}` : '';
	return `${betPart}|${row.line ?? ''}|${row.selectionCode}`;
}

export type OddsRowSelection = {
	selectionKey: string;
	bookmaker: string;
	clientOdds: number;
	displayLabel: string;
	line?: string | null;
	groupKey: string;
	betTitle: BetTitle;
};

type Props = {
	group: OddsMarketGroup;
	bookmakers: string[];
	displayMode?: 'bookmakers' | 'best';
	showSourcePaths?: boolean;
	pickMode?: boolean;
	selectable?: boolean;
	selectedKey?: string | null;
	selectedBookmaker?: string | null;
	onSelect?: (selection: OddsRowSelection) => void;
	disabled?: boolean;
	/** Вложенная подкатегория внутри parent-группы (другой оттенок, компактнее). */
	nested?: boolean;
};

export default function OddsMarketGroupAccordion({
	group,
	bookmakers,
	displayMode = 'bookmakers',
	showSourcePaths = false,
	pickMode = false,
	selectable = false,
	selectedKey,
	selectedBookmaker,
	onSelect,
	disabled = false,
	nested = false,
}: Props): JSX.Element {
	const { t } = useTranslation();
	const showLine = LINE_COLUMN_CATEGORIES.has(group.category);
	const title = t(`oddsDemo.groups.${group.groupKey}`, group.groupKey);
	const useBest = displayMode === 'best';

	const renderOddsCell = (odds: string | undefined, sourcePath?: string) => {
		if (!odds || odds === '—') {
			return '—';
		}
		if (!showSourcePaths || !sourcePath) {
			return (
				<Typography component="span" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
					{odds}
				</Typography>
			);
		}
		return (
			<Box
				sx={{
					display: 'inline-flex',
					flexDirection: 'column',
					alignItems: 'flex-end',
					gap: 0.4,
					minWidth: { xs: 100, sm: 130 },
				}}
			>
				<Typography
					component="span"
					sx={{
						fontWeight: 600,
						fontSize: '0.9375rem',
						lineHeight: 1.3,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{odds}
				</Typography>
				<Typography
					component="span"
					sx={{
						color: 'text.secondary',
						fontFamily: 'monospace',
						fontSize: '0.75rem',
						lineHeight: 1.4,
						textAlign: 'right',
						whiteSpace: 'nowrap',
						opacity: 0.85,
					}}
				>
					{sourcePath}
				</Typography>
			</Box>
		);
	};

	const demoTableSx = showSourcePaths
		? {
				'& .MuiTableCell-root': {
					py: 1.25,
					px: { xs: 1.25, sm: 1.75 },
					fontSize: '0.875rem',
					lineHeight: 1.45,
					verticalAlign: 'middle',
					borderColor: 'divider',
				},
				'& .MuiTableCell-head': {
					fontWeight: 700,
					fontSize: '0.8125rem',
					py: 1,
					color: 'text.primary',
					whiteSpace: 'nowrap',
					bgcolor: (theme: Theme) =>
						theme.palette.mode === 'light'
							? theme.palette.grey[100]
							: theme.palette.grey[800],
					borderBottom: '1px solid',
					borderColor: 'divider',
				},
				'& .MuiTableRow-root:last-child .MuiTableCell-root': {
					borderBottom: 0,
				},
			}
		: undefined;

	const demoBookmakerCellSx = showSourcePaths
		? { minWidth: { xs: 108, sm: 140 }, width: '18%', whiteSpace: 'nowrap' as const }
		: undefined;

	const resolveBookmaker = (row: OddsMarketGroup['rows'][number]): string | undefined => {
		if (row.bestBookmaker) {
			return row.bestBookmaker;
		}
		for (const [bk, value] of Object.entries(row.bookmakerOdds ?? {})) {
			if (value && value !== '—') {
				return bk;
			}
		}
		return undefined;
	};

	const resolveOdds = (row: OddsMarketGroup['rows'][number], bookmaker?: string): string | undefined => {
		if (row.bestOdds && row.bestOdds !== '—') {
			return row.bestOdds;
		}
		if (bookmaker) {
			return row.bookmakerOdds?.[bookmaker];
		}
		return undefined;
	};

	const handleRowClick = (row: OddsMarketGroup['rows'][number]) => {
		if (!selectable || disabled || !onSelect || !row.selectionKey || !row.betTitle) {
			return;
		}
		const bookmaker = resolveBookmaker(row);
		const odds = resolveOdds(row, bookmaker);
		if (!bookmaker || !odds || odds === '—') {
			return;
		}
		const parsed = Number.parseFloat(odds.replace(',', '.'));
		if (Number.isNaN(parsed)) {
			return;
		}
		onSelect({
			selectionKey: row.selectionKey,
			bookmaker,
			clientOdds: parsed,
			displayLabel: row.displayLabel,
			line: row.line,
			groupKey: group.groupKey,
			betTitle: row.betTitle,
		});
	};

	if (pickMode) {
		return (
			<Accordion
				defaultExpanded={!group.collapsedByDefault}
				disableGutters
				sx={nested ? oddsPickSubAccordionSx : oddsPickAccordionSx}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					sx={nested ? oddsPickSubAccordionSummarySx : oddsPickAccordionSummarySx}
				>
					<Typography
						fontWeight={nested ? 600 : 700}
						fontSize={nested ? '0.84rem' : '0.9rem'}
						textTransform="none"
					>
						{title}
						<Typography
							component="span"
							sx={{
								ml: 0.75,
								fontWeight: 600,
								fontSize: nested ? '0.8rem' : '0.85rem',
								opacity: nested ? 0.65 : 0.72,
							}}
						>
							({group.rows.length})
						</Typography>
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={nested ? oddsPickSubAccordionDetailsSx : oddsPickAccordionDetailsSx}>
					{group.rows.map((row) => {
						const displayOdds = row.bestOdds ?? '—';
						const clickable =
							selectable &&
							useBest &&
							!disabled &&
							Boolean(row.selectionKey && row.betTitle && displayOdds !== '—');

						return (
							<Box
								key={rowReactKey(row)}
								role={clickable ? 'button' : undefined}
								tabIndex={clickable ? 0 : undefined}
								onClick={() => handleRowClick(row)}
								onKeyDown={
									clickable
										? (e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleRowClick(row);
												}
											}
										: undefined
								}
								sx={oddsPickRowSx(Boolean(clickable))}
							>
								<Typography component="span" sx={oddsPickRowLabelSx}>
									{row.displayLabel}
								</Typography>
								<Typography component="span" sx={oddsPickRowOddsSx}>
									{displayOdds === '—' ? displayOdds : formatPickOdds(displayOdds)}
								</Typography>
							</Box>
						);
					})}
				</AccordionDetails>
			</Accordion>
		);
	}

	return (
		<Accordion
			defaultExpanded={!group.collapsedByDefault}
			disableGutters
			sx={{
				mb: showSourcePaths ? 1.5 : 1,
				'&:before': { display: 'none' },
				...(showSourcePaths && {
					borderRadius: 2,
					border: '1px solid',
					borderColor: 'divider',
					overflow: 'hidden',
					'& .MuiAccordionSummary-root': { minHeight: 48, px: { xs: 1.25, sm: 1.75 } },
					'& .MuiAccordionDetails-root': { p: 0 },
				}),
			}}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography fontWeight={600} fontSize={showSourcePaths ? '0.9375rem' : undefined}>
					{title}
					<Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
						({group.rows.length})
					</Typography>
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={showSourcePaths ? { p: 0 } : { pt: 0 }}>
				<TableContainer
					component={Paper}
					variant="outlined"
					sx={
						showSourcePaths
							? { borderRadius: 0, overflow: 'auto', border: 'none', boxShadow: 'none' }
							: undefined
					}
				>
					<Table size={showSourcePaths ? 'medium' : 'small'} sx={demoTableSx}>
						<TableHead>
							<TableRow>
								{showLine && (
									<TableCell sx={{ width: showSourcePaths ? 80 : 72 }}>
										{t('oddsDemo.line', 'Линия')}
									</TableCell>
								)}
								<TableCell sx={showSourcePaths ? { minWidth: 88 } : undefined}>
									{t('oddsDemo.selection', 'Исход')}
								</TableCell>
								{useBest ? (
									<TableCell align="right" sx={demoBookmakerCellSx}>
										{t('wc26.oddsPick.bestOdds', 'Кэф')}
									</TableCell>
								) : (
									bookmakers.map((bk) => (
										<TableCell key={bk} align="right" sx={demoBookmakerCellSx}>
											{bk}
										</TableCell>
									))
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{group.rows.map((row) => {
								const isMismatch = showSourcePaths && Boolean(row.crossBookmakerMismatch);
								const isSelected =
									selectable &&
									row.selectionKey === selectedKey &&
									row.bestBookmaker === selectedBookmaker;
								const displayOdds = row.bestOdds ?? '—';
								const clickable =
									selectable &&
									useBest &&
									!disabled &&
									!isMismatch &&
									row.selectionKey &&
									row.bestBookmaker &&
									displayOdds !== '—';

								return (
									<TableRow
										key={rowReactKey(row)}
										hover={Boolean(clickable) && !isMismatch}
										selected={isSelected}
										onClick={() => handleRowClick(row)}
										sx={{
											cursor: clickable ? 'pointer' : 'default',
											'&.Mui-selected': { bgcolor: 'action.selected' },
											...(isMismatch && {
												bgcolor: (theme) =>
													theme.palette.mode === 'light'
														? 'rgba(255, 235, 235, 0.95)'
														: 'rgba(244, 67, 54, 0.14)',
												'& .MuiTableCell-root': { fontWeight: 700 },
												'&:hover': {
													bgcolor: (theme) =>
														theme.palette.mode === 'light'
															? 'rgba(255, 228, 228, 0.98)'
															: 'rgba(244, 67, 54, 0.2)',
												},
											}),
											...(showSourcePaths &&
												!isMismatch && {
													'&:hover': { bgcolor: 'action.hover' },
												}),
										}}
									>
										{showLine && (
											<TableCell>
												<Typography
													component="span"
													sx={{
														fontWeight: 500,
														fontVariantNumeric: 'tabular-nums',
													}}
												>
													{row.line ?? '—'}
												</Typography>
											</TableCell>
										)}
										<TableCell>
											<Typography component="span" sx={{ fontWeight: 500 }}>
												{row.displayLabel}
											</Typography>
										</TableCell>
										{useBest ? (
											<TableCell align="right" sx={demoBookmakerCellSx}>
												{renderOddsCell(
													displayOdds,
													row.bestBookmaker
														? row.bookmakerSourcePaths?.[row.bestBookmaker]
														: undefined
												)}
											</TableCell>
										) : (
											bookmakers.map((bk) => (
												<TableCell key={bk} align="right" sx={demoBookmakerCellSx}>
													{renderOddsCell(
														row.bookmakerOdds[bk],
														row.bookmakerSourcePaths?.[bk]
													)}
												</TableCell>
											))
										)}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</AccordionDetails>
		</Accordion>
	);
}
