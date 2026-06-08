import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import OddsMarketGroupAccordion, { type OddsRowSelection } from './OddsMarketGroupAccordion';
import { oddsGroupTitle } from './oddsGroupTitle';
import { OddsMarketGroup } from './oddsTypes';
import {
	oddsPickAccordionSummarySx,
	oddsPickAccordionSx,
	oddsPickNestedListSx,
	oddsPickNestedParentDetailsSx,
} from './oddsPickDialogStyles';

type Props = {
	group: OddsMarketGroup;
	bookmakers: string[];
	displayMode?: 'bookmakers' | 'best';
	pickMode?: boolean;
	selectable?: boolean;
	onSelect?: (selection: OddsRowSelection) => void;
	disabled?: boolean;
};

export default function OddsNestedMarketGroupAccordion({
	group,
	bookmakers,
	displayMode = 'best',
	pickMode = false,
	selectable = false,
	onSelect,
	disabled = false,
}: Props): JSX.Element {
	const { t } = useTranslation();
	const title = oddsGroupTitle(t, group.groupKey);
	const subgroups = group.subgroups ?? [];
	const rowCount = subgroups.reduce((sum, sub) => sum + (sub.rows?.length ?? 0), 0);

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
						({rowCount})
					</Typography>
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={oddsPickNestedParentDetailsSx}>
				<Box sx={oddsPickNestedListSx}>
					{subgroups.map((sub) => (
						<OddsMarketGroupAccordion
							key={sub.groupKey}
							group={sub}
							bookmakers={bookmakers}
							displayMode={displayMode}
							pickMode={pickMode}
							selectable={selectable}
							onSelect={onSelect}
							disabled={disabled}
							nested
						/>
					))}
				</Box>
			</AccordionDetails>
		</Accordion>
	);
}
