import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Typography,
	useTheme,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { t } from 'i18next';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resolveBetCodes } from '../../components/utils/betTitleCodesGrouping';
import { getBetTitleCodeLabelMap } from './betsSlice';
import betTitleGroups from './betTitleGroups';
import { selectBetTitleCodeLabelMap } from './selectors';
import { BetTitleGroup } from './types/BetTitleGroup';

const BET_TITLE_PANEL_WIDTH = '20rem';
const GROUP_SUMMARY_HEIGHT = 48;
const NESTED_SUMMARY_HEIGHT = 44;

/** Без анимации высоты — только контент появляется/исчезает, заголовки не двигаются */
const ACCORDION_TRANSITION = { unmountOnExit: true, timeout: 0 };

type BetTitleAccordionPalette = {
	groupBg: string;
	nestedBg: string;
	text: string;
	detailsBg: string;
};

const getBetTitleAccordionPalette = (mode: 'light' | 'dark'): BetTitleAccordionPalette => {
	if (mode === 'light') {
		return {
			groupBg: '#2a4a8a',
			nestedBg: '#4d72c7',
			text: '#ffffff',
			detailsBg: '#e0dfe4',
		};
	}
	return {
		groupBg: '#2a4a8a',
		nestedBg: '#2d6a6e',
		text: '#f5f5f5',
		detailsBg: '#2d3142',
	};
};

const createBetTitleAccordionSx = (headerBg: string): SxProps<Theme> => ({
	width: '100%',
	boxShadow: 'none',
	backgroundImage: 'none',
	color: '#fff',
	backgroundColor: headerBg,
	'&:before': { display: 'none' },
	'&.Mui-expanded': {
		margin: 0,
		backgroundColor: headerBg,
	},
	'& .MuiCollapse-root': {
		transition: 'none !important',
	},
});

const createGroupSummarySx = (palette: BetTitleAccordionPalette): SxProps<Theme> => ({
	flexShrink: 0,
	minHeight: GROUP_SUMMARY_HEIGHT,
	height: GROUP_SUMMARY_HEIGHT,
	maxHeight: GROUP_SUMMARY_HEIGHT,
	px: 1.5,
	boxSizing: 'border-box',
	bgcolor: palette.groupBg,
	color: palette.text,
	'&.Mui-expanded': {
		minHeight: GROUP_SUMMARY_HEIGHT,
		height: GROUP_SUMMARY_HEIGHT,
		maxHeight: GROUP_SUMMARY_HEIGHT,
		bgcolor: palette.groupBg,
	},
	'& .MuiAccordionSummary-content': {
		my: 0,
		'&.Mui-expanded': { my: 0 },
	},
	'& .MuiAccordionSummary-expandIconWrapper': {
		color: 'inherit',
	},
});

const createNestedSummarySx = (palette: BetTitleAccordionPalette): SxProps<Theme> => ({
	flexShrink: 0,
	minHeight: NESTED_SUMMARY_HEIGHT,
	height: NESTED_SUMMARY_HEIGHT,
	maxHeight: NESTED_SUMMARY_HEIGHT,
	px: 1.5,
	boxSizing: 'border-box',
	bgcolor: palette.nestedBg,
	color: palette.text,
	'&.Mui-expanded': {
		minHeight: NESTED_SUMMARY_HEIGHT,
		height: NESTED_SUMMARY_HEIGHT,
		maxHeight: NESTED_SUMMARY_HEIGHT,
		bgcolor: palette.nestedBg,
	},
	'& .MuiAccordionSummary-content': {
		my: 0,
		'&.Mui-expanded': { my: 0 },
	},
	'& .MuiAccordionSummary-expandIconWrapper': {
		color: 'inherit',
	},
});

const createBetTitleDetailsSx = (palette: BetTitleAccordionPalette): SxProps<Theme> => ({
	px: 0.5,
	py: 0.5,
	boxSizing: 'border-box',
	width: '100%',
	display: 'block',
	bgcolor: palette.detailsBg,
	color: palette.detailsBg === '#e0dfe4' ? 'text.primary' : palette.text,
});

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
		<Box
			display="flex"
			flexWrap="wrap"
			justifyContent="center"
			sx={{ width: '100%', boxSizing: 'border-box' }}
		>
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
	palette,
}: {
	subgroup: ResolvedSubgroup;
	expanded: boolean;
	onChange: (title: string) => (_: React.SyntheticEvent, isExpanded: boolean) => void;
	labels: Record<number, string> | undefined;
	onSelect: (code: number, label: string) => void;
	palette: BetTitleAccordionPalette;
}): JSX.Element | null {
	if (subgroup.codes.length === 0) {
		return null;
	}

	return (
		<Accordion
			disableGutters
			elevation={0}
			square
			sx={createBetTitleAccordionSx(palette.nestedBg)}
			TransitionProps={ACCORDION_TRANSITION}
			expanded={expanded}
			onChange={onChange(subgroup.title)}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={createNestedSummarySx(palette)}>
				<Typography variant="body2" noWrap>
					{subgroup.title}
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={createBetTitleDetailsSx(palette)}>
				{expanded ? (
					<BetTitleCodeButtons codes={subgroup.codes} labels={labels} onSelect={onSelect} />
				) : null}
			</AccordionDetails>
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
	palette,
}: {
	group: ResolvedGroup;
	expanded: boolean;
	nestedExpanded: string | false;
	onGroupChange: (title: string) => (_: React.SyntheticEvent, isExpanded: boolean) => void;
	onNestedChange: (title: string) => (_: React.SyntheticEvent, isExpanded: boolean) => void;
	labels: Record<number, string> | undefined;
	onSelect: (code: number, label: string) => void;
	palette: BetTitleAccordionPalette;
}): JSX.Element {
	const hasContent =
		group.codes.length > 0 || (group.subgroups?.some((s) => s.codes.length > 0) ?? false);

	if (!hasContent) {
		return <></>;
	}

	return (
		<Accordion
			disableGutters
			elevation={0}
			square
			sx={createBetTitleAccordionSx(palette.groupBg)}
			TransitionProps={ACCORDION_TRANSITION}
			expanded={expanded}
			onChange={onGroupChange(group.title)}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={createGroupSummarySx(palette)}>
				<Typography noWrap>{group.title}</Typography>
			</AccordionSummary>
			<AccordionDetails sx={createBetTitleDetailsSx(palette)}>
				{expanded && group.codes.length > 0 && (
					<BetTitleCodeButtons codes={group.codes} labels={labels} onSelect={onSelect} />
				)}
				{expanded &&
					group.subgroups?.map((sub) => (
						<NestedBetTitleAccordion
							key={sub.title}
							subgroup={sub}
							expanded={nestedExpanded === sub.title}
							onChange={onNestedChange}
							labels={labels}
							onSelect={onSelect}
							palette={palette}
						/>
					))}
			</AccordionDetails>
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
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const betTitleCodeLabelMap = useAppSelector(selectBetTitleCodeLabelMap);
	const accordionPalette = useMemo(
		() => getBetTitleAccordionPalette(theme.palette.mode),
		[theme.palette.mode]
	);
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
			sx={{
				mt: 2,
				textAlign: 'center',
				width: BET_TITLE_PANEL_WIDTH,
				minWidth: BET_TITLE_PANEL_WIDTH,
				maxWidth: BET_TITLE_PANEL_WIDTH,
				boxSizing: 'border-box',
				scrollbarGutter: 'stable',
				position: 'relative',
				zIndex: 1,
			}}
			onPointerDownCapture={handlePointerDownCapture}
		>
			<Typography sx={{ textAlign: 'left', mx: 1, mt: 1, fontWeight: '600' }}>
				{t('bet')}
			</Typography>
			<Box sx={{ width: '100%', boxSizing: 'border-box' }}>
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
						palette={accordionPalette}
					/>
				))}
			</Box>
		</Box>
	);
}
