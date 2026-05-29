import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OddsMarketGroup } from './types';

const LINE_COLUMN_CATEGORIES = new Set([
	'HANDICAP',
	'TOTALS',
	'TEAM_TOTAL_HOME',
	'TEAM_TOTAL_AWAY',
]);

type Props = {
	group: OddsMarketGroup;
	bookmakers: string[];
};

export default function OddsMarketGroupAccordion({ group, bookmakers }: Props): JSX.Element {
	const { t } = useTranslation();
	const showLine = LINE_COLUMN_CATEGORIES.has(group.category);
	const title = t(`oddsDemo.groups.${group.groupKey}`, group.groupKey);

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
								{bookmakers.map((bk) => (
									<TableCell key={bk} align="right">
										{bk}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{group.rows.map((row) => (
								<TableRow
									key={`${row.line ?? ''}-${row.selectionCode}`}
									hover
								>
									{showLine && <TableCell>{row.line ?? '—'}</TableCell>}
									<TableCell>{row.displayLabel}</TableCell>
									{bookmakers.map((bk) => (
										<TableCell key={bk} align="right">
											{row.bookmakerOdds[bk] ?? '—'}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</AccordionDetails>
		</Accordion>
	);
}
