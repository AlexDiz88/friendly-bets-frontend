import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	FormControl,
	TextField,
	Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import {
	TEAM_EXTERNAL_ALIAS_FIELDS,
	TeamFormValues,
	teamApiLogoSrc,
} from './teamFormUtils';
import { isInactiveExternalProvider } from './teamProviderConstants';
import { InactiveProviderMark } from './ProviderOptionLabel';

type TeamFormFieldsProps = {
	values: TeamFormValues;
	onChange: (patch: Partial<TeamFormValues>) => void;
	titleReadOnly?: boolean;
	/** Expand aliases accordion (e.g. after chip → team mapping). */
	forceExpandAliases?: boolean;
};

export default function TeamFormFields({
	values,
	onChange,
	titleReadOnly = false,
	forceExpandAliases = false,
}: TeamFormFieldsProps): JSX.Element {
	const fieldSx = { mb: 1.5 };
	const [displayNamesOpen, setDisplayNamesOpen] = useState(false);
	const [aliasesOpen, setAliasesOpen] = useState(false);

	useEffect(() => {
		if (forceExpandAliases) {
			setAliasesOpen(true);
		}
	}, [forceExpandAliases]);

	const accordionSx = {
		mb: 0.75,
		'&::before': { display: 'none' },
		boxShadow: 'none',
		border: '1px solid',
		borderColor: 'divider',
		borderRadius: '8px !important',
		overflow: 'hidden',
		'&.Mui-expanded': { margin: '0 0 6px 0' },
	};

	const summarySx = {
		minHeight: 36,
		px: 1.25,
		py: 0,
		'& .MuiAccordionSummary-content': { my: 0.5 },
		'&.Mui-expanded': { minHeight: 36 },
	};

	const detailsSx = {
		pt: 1.25,
		px: 1.25,
		pb: 1,
	};

	return (
		<FormControl fullWidth>
			<TextField
				fullWidth
				size="small"
				sx={fieldSx}
				required={!titleReadOnly}
				id="team-title"
				label={t('teamTitle')}
				variant="outlined"
				value={values.title}
				onChange={(e) => onChange({ title: e.target.value })}
				disabled={titleReadOnly}
				InputProps={titleReadOnly ? { readOnly: true } : undefined}
			/>
			<TextField
				fullWidth
				size="small"
				sx={fieldSx}
				required
				id="team-country"
				label={t('teamCountry')}
				variant="outlined"
				value={values.country}
				onChange={(e) => onChange({ country: e.target.value })}
			/>

			<Accordion
				disableGutters
				expanded={displayNamesOpen}
				onChange={(_e, expanded) => setDisplayNamesOpen(expanded)}
				sx={accordionSx}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
					<Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'left' }}>
						{t('teamDisplayNamesSection')}
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={detailsSx}>
					<TextField
						fullWidth
						size="small"
						sx={fieldSx}
						id="team-name-en"
						label={t('teamNameEn')}
						variant="outlined"
						value={values.nameEn}
						onChange={(e) => onChange({ nameEn: e.target.value })}
					/>
					<TextField
						fullWidth
						size="small"
						sx={fieldSx}
						id="team-name-de"
						label={t('teamNameDe')}
						variant="outlined"
						value={values.nameDe}
						onChange={(e) => onChange({ nameDe: e.target.value })}
					/>
					<TextField
						fullWidth
						size="small"
						sx={{ mb: 0 }}
						id="team-name-ru"
						label={t('teamNameRu')}
						variant="outlined"
						value={values.nameRu}
						onChange={(e) => onChange({ nameRu: e.target.value })}
					/>
				</AccordionDetails>
			</Accordion>

			<Accordion
				disableGutters
				expanded={aliasesOpen}
				onChange={(_e, expanded) => setAliasesOpen(expanded)}
				sx={accordionSx}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
					<Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'left' }}>
						{t('teamExternalAliasesSection')}
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={detailsSx}>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						{TEAM_EXTERNAL_ALIAS_FIELDS.filter(({ provider }) => !isInactiveExternalProvider(provider)).map(
							(field) => (
								<AliasFieldRow key={field.field} {...field} values={values} onChange={onChange} />
							)
						)}
					</Box>
					{TEAM_EXTERNAL_ALIAS_FIELDS.some(({ provider }) => isInactiveExternalProvider(provider)) ? (
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: 'block', mt: 0.25, mb: 1, fontWeight: 600 }}
						>
							{t('inactiveExternalProvidersGroup')}
						</Typography>
					) : null}
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						{TEAM_EXTERNAL_ALIAS_FIELDS.filter(({ provider }) => isInactiveExternalProvider(provider)).map(
							(field) => (
								<AliasFieldRow key={field.field} {...field} values={values} onChange={onChange} />
							)
						)}
					</Box>
				</AccordionDetails>
			</Accordion>
		</FormControl>
	);
}

type AliasField = (typeof TEAM_EXTERNAL_ALIAS_FIELDS)[number];

function AliasFieldRow({
	field,
	sectionKey,
	labelKey,
	inputId,
	provider,
	values,
	onChange,
}: AliasField & {
	values: TeamFormValues;
	onChange: (patch: Partial<TeamFormValues>) => void;
}): JSX.Element {
	const inactive = isInactiveExternalProvider(provider);
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				mb: 1.5,
				'&:last-of-type': { mb: 0 },
			}}
		>
			<Box
				component="img"
				src={teamApiLogoSrc(provider)}
				alt={t(sectionKey)}
				title={t(sectionKey)}
				sx={{
					width: 20,
					height: 20,
					objectFit: 'contain',
					flexShrink: 0,
					borderRadius: 0.5,
					opacity: inactive ? 0.55 : 1,
				}}
			/>
			<TextField
				fullWidth
				size="small"
				id={inputId}
				label={t(labelKey)}
				variant="outlined"
				value={values[field]}
				onChange={(e) => onChange({ [field]: e.target.value })}
			/>
			{inactive ? <InactiveProviderMark /> : null}
		</Box>
	);
}
