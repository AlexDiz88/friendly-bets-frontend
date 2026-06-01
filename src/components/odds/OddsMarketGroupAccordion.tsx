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
} from './oddsPickDialogStyles';

const LINE_COLUMN_CATEGORIES = new Set([
	'HANDICAP',
	'TOTALS',
	'TEAM_TOTAL_HOME',
	'TEAM_TOTAL_AWAY',
]);

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
	pickMode?: boolean;
	selectable?: boolean;
	selectedKey?: string | null;
	selectedBookmaker?: string | null;
	onSelect?: (selection: OddsRowSelection) => void;
	disabled?: boolean;
};

export default function OddsMarketGroupAccordion({
	group,
	bookmakers,
	displayMode = 'bookmakers',
	pickMode = false,
	selectable = false,
	selectedKey,
	selectedBookmaker,
	onSelect,
	disabled = false,
}: Props): JSX.Element {
	const { t } = useTranslation();
	const showLine = LINE_COLUMN_CATEGORIES.has(group.category);
	const title = t(`oddsDemo.groups.${group.groupKey}`, group.groupKey);
	const useBest = displayMode === 'best';

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
				sx={oddsPickAccordionSx}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={oddsPickAccordionSummarySx}>
					<Typography fontWeight={700} fontSize="0.9rem" textTransform="none">
						{title}
						<Typography
							component="span"
							sx={{ ml: 0.75, fontWeight: 600, fontSize: '0.85rem', opacity: 0.72 }}
						>
							({group.rows.length})
						</Typography>
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={oddsPickAccordionDetailsSx}>
					{group.rows.map((row) => {
						const displayOdds = row.bestOdds ?? '—';
						const clickable =
							selectable &&
							useBest &&
							!disabled &&
							Boolean(row.selectionKey && row.betTitle && displayOdds !== '—');

						return (
							<Box
								key={`${row.line ?? ''}-${row.selectionCode}-${row.selectionKey ?? ''}`}
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
			sx={{ mb: 1, '&:before': { display: 'none' } }}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography fontWeight={600}>
					{title}
					<Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
						({group.rows.length})
					</Typography>
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ pt: 0 }}>
				<TableContainer component={Paper} variant="outlined">
					<Table size="small">
						<TableHead>
							<TableRow>
								{showLine && (
									<TableCell sx={{ width: 72 }}>{t('oddsDemo.line', 'Линия')}</TableCell>
								)}
								<TableCell>{t('oddsDemo.selection', 'Исход')}</TableCell>
								{useBest ? (
									<TableCell align="right">{t('wc26.oddsPick.bestOdds', 'Кэф')}</TableCell>
								) : (
									bookmakers.map((bk) => (
										<TableCell key={bk} align="right">
											{bk}
										</TableCell>
									))
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{group.rows.map((row) => {
								const isSelected =
									selectable &&
									row.selectionKey === selectedKey &&
									row.bestBookmaker === selectedBookmaker;
								const displayOdds = row.bestOdds ?? '—';
								const clickable =
									selectable &&
									useBest &&
									!disabled &&
									row.selectionKey &&
									row.bestBookmaker &&
									displayOdds !== '—';

								return (
									<TableRow
										key={`${row.line ?? ''}-${row.selectionCode}-${row.selectionKey ?? ''}`}
										hover={Boolean(clickable)}
										selected={isSelected}
										onClick={() => handleRowClick(row)}
										sx={{
											cursor: clickable ? 'pointer' : 'default',
											'&.Mui-selected': { bgcolor: 'action.selected' },
										}}
									>
										{showLine && <TableCell>{row.line ?? '—'}</TableCell>}
										<TableCell>{row.displayLabel}</TableCell>
										{useBest ? (
											<TableCell align="right">
												<Typography component="span" fontWeight={600}>
													{displayOdds}
												</Typography>
											</TableCell>
										) : (
											bookmakers.map((bk) => (
												<TableCell key={bk} align="right">
													{row.bookmakerOdds[bk] ?? '—'}
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
