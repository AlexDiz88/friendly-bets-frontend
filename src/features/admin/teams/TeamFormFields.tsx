import { FormControl, TextField, Typography, Box } from '@mui/material';
import { t } from 'i18next';
import { TEAM_EXTERNAL_ALIAS_FIELDS, TeamFormValues } from './teamFormUtils';

type TeamFormFieldsProps = {
	values: TeamFormValues;
	onChange: (patch: Partial<TeamFormValues>) => void;
	titleReadOnly?: boolean;
};

export default function TeamFormFields({
	values,
	onChange,
	titleReadOnly = false,
}: TeamFormFieldsProps): JSX.Element {
	const fieldSx = { mb: 0.75 };
	const sectionSx = { mt: 1, fontWeight: 600, fontSize: '0.875rem', textAlign: 'left' };
	const sectionContentSx = { mt: '5px' };

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
				sx={fieldSx}
				id="team-name-ru"
				label={t('teamNameRu')}
				variant="outlined"
				value={values.nameRu}
				onChange={(e) => onChange({ nameRu: e.target.value })}
			/>

			{TEAM_EXTERNAL_ALIAS_FIELDS.map(({ field, sectionKey, labelKey, inputId }) => (
				<Box key={field}>
					<Typography sx={sectionSx}>{t(sectionKey)}</Typography>
					<Box sx={sectionContentSx}>
						<TextField
							fullWidth
							size="small"
							sx={fieldSx}
							id={inputId}
							label={t(labelKey)}
							variant="outlined"
							value={values[field]}
							onChange={(e) => onChange({ [field]: e.target.value })}
						/>
					</Box>
				</Box>
			))}
		</FormControl>
	);
}
