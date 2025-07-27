import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getBetTitleCodeLabelMap } from './betsSlice';
import betTitleGroups from './betTitleGroups';
import { selectBetTitleCodeLabelMap } from './selectors';
import { BetTitleGroup } from './types/BetTitleGroup';

export default function BetInputTitle({
	onBetTitleSelect,
}: {
	onBetTitleSelect: (code: number, label: string) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const betTitleCodeLabelMap = useAppSelector(selectBetTitleCodeLabelMap);
	const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
	const [expandedNestedAccordion, setExpandedNestedAccordion] = useState<string | false>(false);

	useEffect(() => {
		if (!betTitleCodeLabelMap) dispatch(getBetTitleCodeLabelMap());
	}, []);

	const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) =>
		setExpandedAccordion(isExpanded ? panel : false);

	const handleNestedAccordionChange =
		(panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) =>
			setExpandedNestedAccordion(isExpanded ? panel : false);

	const handleButtonClick = (code: number): void => {
		const label = betTitleCodeLabelMap?.[code] ?? 'Unknown';
		onBetTitleSelect(code, label);
	};

	const renderButtons = (codes: number[]): JSX.Element => (
		<Box display="flex" flexWrap="wrap" justifyContent="center">
			{codes.map((code) => (
				<Button
					key={code}
					sx={{ px: 0, m: 0.5, bgcolor: '#525252', height: '3rem', width: '5.5rem' }}
					variant="contained"
					onClick={() => handleButtonClick(code)}
				>
					<Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
						{betTitleCodeLabelMap?.[code] || code}
					</Typography>
				</Button>
			))}
		</Box>
	);

	const renderGroup = (group: BetTitleGroup): JSX.Element => (
		<Accordion
			key={group.title}
			expanded={expandedAccordion === group.title}
			onChange={handleAccordionChange(group.title)}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography>{group.title}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{group.codes && renderButtons(group.codes)}
				{group.subgroups &&
					group.subgroups.map((sub) => (
						<Accordion
							key={sub.title}
							expanded={expandedNestedAccordion === sub.title}
							onChange={handleNestedAccordionChange(sub.title)}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>{sub.title}</Typography>
							</AccordionSummary>
							<AccordionDetails>{renderButtons(sub.codes)}</AccordionDetails>
						</Accordion>
					))}
			</AccordionDetails>
		</Accordion>
	);

	return (
		<Box sx={{ mt: 1.5, textAlign: 'center', maxWidth: '20rem' }}>
			<Typography sx={{ textAlign: 'left', mx: 1, mt: 1, fontWeight: '600' }}>
				{t('bet')}
			</Typography>
			{betTitleGroups.map(renderGroup)}
		</Box>
	);
}
