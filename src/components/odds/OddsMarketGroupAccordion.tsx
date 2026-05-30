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
};

type Props = {
	group: OddsMarketGroup;
	bookmakers: string[];
	displayMode?: 'bookmakers' | 'best';
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

	const handleRowClick = (row: OddsMarketGroup['rows'][number]) => {
		if (!selectable || disabled || !onSelect || !row.selectionKey) {
			return;
		}
		const bookmaker = row.bestBookmaker;
		const odds = row.bestOdds ?? (bookmaker ? row.bookmakerOdds[bookmaker] : undefined);
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
		});
	};

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
												<Box>
													<Typography component="span" fontWeight={600}>
														{displayOdds}
													</Typography>
													{row.bestBookmaker && displayOdds !== '—' && (
														<Typography
															component="span"
															variant="caption"
															color="text.secondary"
															sx={{ ml: 0.5 }}
														>
															{row.bestBookmaker}
														</Typography>
													)}
												</Box>
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
