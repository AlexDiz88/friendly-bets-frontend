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
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resolveBetCodes } from '../../components/utils/betTitleCodesGrouping';
import { getBetTitleCodeLabelMap } from './betsSlice';
import betTitleGroups from './betTitleGroups';
import { selectBetTitleCodeLabelMap } from './selectors';
import { BetTitleGroup } from './types/BetTitleGroup';

const ACCORDION_TRANSITION = { unmountOnExit: true, timeout: 120 };

type ResolvedSubgroup = { title: string; codes: number[] };
type ResolvedGroup = { title: string; codes: number[]; subgroups?: ResolvedSubgroup[] };

const getLabelFontSize = (label: string): string => {
	if (label.length > 18) return '0.65rem';
	if (label.length > 15) return '0.7rem';
	if (label.length > 12) return '0.8rem';
	return '0.85rem';
};

const BetTitleCodeButtons = memo(function BetTitleCodeButtons({
	codes,
	labels,
	onSelect,
}: {
	codes: number[];
	labels: Record<number, string> | undefined;
	onSelect: (code: number, label: string) => void;
}): JSX.Element {
	return (
		<Box display="flex" flexWrap="wrap" justifyContent="center">
			{codes.map((code) => {
				const label = labels?.[code] ?? String(code);
				return (
					<Button
						key={code}
						sx={{ px: 0.2, m: 0.5, bgcolor: '#525252', height: '3rem', width: '5.5rem' }}
						variant="contained"
						onClick={() => onSelect(code, label)}
					>
						<Typography
							sx={{ fontWeight: 600, fontSize: getLabelFontSize(label), textTransform: 'none' }}
						>
							{label}
						</Typography>
					</Button>
				);
			})}
		</Box>
	);
});

const NestedBetTitleAccordion = memo(function NestedBetTitleAccordion({
	subgroup,
	expanded,
	onChange,
	labels,
	onSelect,
}: {
	subgroup: ResolvedSubgroup;
	expanded: boolean;
	onChange: (title: string) => (_: React.SyntheticEvent, isExpanded: boolean) => void;
	labels: Record<number, string> | undefined;
	onSelect: (code: number, label: string) => void;
}): JSX.Element | null {
	if (subgroup.codes.length === 0) {
		return null;
	}

	return (
		<Accordion
			disableGutters
			TransitionProps={ACCORDION_TRANSITION}
			expanded={expanded}
			onChange={onChange(subgroup.title)}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant="body2">{subgroup.title}</Typography>
			</AccordionSummary>
			{expanded && (
				<AccordionDetails sx={{ py: 0.5 }}>
					<BetTitleCodeButtons codes={subgroup.codes} labels={labels} onSelect={onSelect} />
				</AccordionDetails>
			)}
		</Accordion>
	);
});

const BetTitleGroupAccordion = memo(function BetTitleGroupAccordion({
	group,
	expanded,
	nestedExpanded,
	onGroupChange,
	onNestedChange,
	labels,
	onSelect,
}: {
	group: ResolvedGroup;
	expanded: boolean;
	nestedExpanded: string | false;
	onGroupChange: (title: string) => (_: React.SyntheticEvent, isExpanded: boolean) => void;
	onNestedChange: (title: string) => (_: React.SyntheticEvent, isExpanded: boolean) => void;
	labels: Record<number, string> | undefined;
	onSelect: (code: number, label: string) => void;
}): JSX.Element {
	const hasContent =
		group.codes.length > 0 || (group.subgroups?.some((s) => s.codes.length > 0) ?? false);

	if (!hasContent) {
		return <></>;
	}

	return (
		<Accordion
			disableGutters
			TransitionProps={ACCORDION_TRANSITION}
			expanded={expanded}
			onChange={onGroupChange(group.title)}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography>{group.title}</Typography>
			</AccordionSummary>
			{expanded && (
				<AccordionDetails sx={{ py: 0.5 }}>
					{group.codes.length > 0 && (
						<BetTitleCodeButtons codes={group.codes} labels={labels} onSelect={onSelect} />
					)}
					{group.subgroups?.map((sub) => (
						<NestedBetTitleAccordion
							key={sub.title}
							subgroup={sub}
							expanded={nestedExpanded === sub.title}
							onChange={onNestedChange}
							labels={labels}
							onSelect={onSelect}
						/>
					))}
				</AccordionDetails>
			)}
		</Accordion>
	);
});

const resolveGroups = (
	groups: BetTitleGroup[],
	allCodes: number[]
): ResolvedGroup[] =>
	groups.map((group) => ({
		title: group.title,
		codes: resolveBetCodes(group, allCodes),
		subgroups: group.subgroups
			?.map((sub) => ({
				title: sub.title,
				codes: resolveBetCodes(sub, allCodes),
			}))
			.filter((sub) => sub.codes.length > 0),
	}));

const blurActiveElement = (): void => {
	const active = document.activeElement;
	if (active instanceof HTMLElement) {
		active.blur();
	}
};

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
		if (!betTitleCodeLabelMap) {
			dispatch(getBetTitleCodeLabelMap());
		}
	}, [betTitleCodeLabelMap, dispatch]);

	const resolvedGroups = useMemo(() => {
		const allCodes = Object.keys(betTitleCodeLabelMap ?? {}).map((c) => Number(c));
		return resolveGroups(betTitleGroups, allCodes);
	}, [betTitleCodeLabelMap]);

	const handleAccordionChange = useCallback(
		(panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
			setExpandedAccordion(isExpanded ? panel : false);
			if (isExpanded) {
				setExpandedNestedAccordion(false);
			}
		},
		[]
	);

	const handleNestedAccordionChange = useCallback(
		(panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
			setExpandedNestedAccordion(isExpanded ? panel : false);
		},
		[]
	);

	const handlePointerDownCapture = useCallback(() => {
		blurActiveElement();
	}, []);

	return (
		<Box
			sx={{ textAlign: 'center', maxWidth: '20rem', position: 'relative', zIndex: 1 }}
			onPointerDownCapture={handlePointerDownCapture}
		>
			<Typography sx={{ textAlign: 'left', mx: 1, mt: 1, fontWeight: '600' }}>
				{t('bet')}
			</Typography>
			{resolvedGroups.map((group) => (
				<BetTitleGroupAccordion
					key={group.title}
					group={group}
					expanded={expandedAccordion === group.title}
					nestedExpanded={expandedNestedAccordion}
					onGroupChange={handleAccordionChange}
					onNestedChange={handleNestedAccordionChange}
					labels={betTitleCodeLabelMap}
					onSelect={onBetTitleSelect}
				/>
			))}
		</Box>
	);
}
