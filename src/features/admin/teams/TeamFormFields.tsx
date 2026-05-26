import { Box, FormControl, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import UnmappedTeamNameHints from './UnmappedTeamNameHints';
import { hasFootballDataApiMapping, TeamFormValues } from './teamFormUtils';

type TeamFormFieldsProps = {
	values: TeamFormValues;
	onChange: (patch: Partial<TeamFormValues>) => void;
	titleReadOnly?: boolean;
	unmappedHintsRefreshKey?: number;
};

export default function TeamFormFields({
	values,
	onChange,
	titleReadOnly = false,
	unmappedHintsRefreshKey = 0,
}: TeamFormFieldsProps): JSX.Element {
	const showUnmappedHints = !hasFootballDataApiMapping(values);

	return (
		<FormControl fullWidth>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required={!titleReadOnly}
					id="team-title"
					label={t('teamTitle')}
					variant="outlined"
					value={values.title}
					onChange={(e) => onChange({ title: e.target.value })}
					helperText={titleReadOnly ? undefined : t('teamTitlePascalCaseHint')}
					disabled={titleReadOnly}
					InputProps={titleReadOnly ? { readOnly: true } : undefined}
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required
					id="team-country"
					label={t('teamCountry')}
					variant="outlined"
					value={values.country}
					onChange={(e) => onChange({ country: e.target.value })}
					helperText={t('abbreviatedTeamCountry')}
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					id="team-name-en"
					label={t('teamNameEn')}
					variant="outlined"
					value={values.nameEn}
					onChange={(e) => onChange({ nameEn: e.target.value })}
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					id="team-name-ru"
					label={t('teamNameRu')}
					variant="outlined"
					value={values.nameRu}
					onChange={(e) => onChange({ nameRu: e.target.value })}
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					id="team-name-de"
					label={t('teamNameDe')}
					variant="outlined"
					value={values.nameDe}
					onChange={(e) => onChange({ nameDe: e.target.value })}
				/>
			</Box>

			<Typography sx={{ mt: 1.5, mb: 0.5, fontWeight: 600, textAlign: 'left' }}>
				{t('teamApiDataSection')}
			</Typography>
			{showUnmappedHints ? (
				<UnmappedTeamNameHints
					refreshKey={unmappedHintsRefreshKey}
					onApply={(externalName, externalId) => {
						const patch: Partial<TeamFormValues> = {
							footballDataExternalName: externalName,
						};
						if (externalId != null) {
							patch.footballDataTeamId = String(externalId);
						}
						onChange(patch);
					}}
				/>
			) : null}
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					id="football-data-team-id"
					label={t('teamFootballDataId')}
					variant="outlined"
					value={values.footballDataTeamId}
					onChange={(e) => onChange({ footballDataTeamId: e.target.value })}
					helperText={t('teamFootballDataIdHint')}
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					id="football-data-external-name"
					label={t('teamFootballDataExternalName')}
					variant="outlined"
					value={values.footballDataExternalName}
					onChange={(e) => onChange({ footballDataExternalName: e.target.value })}
					helperText={t('teamFootballDataExternalNameHint')}
				/>
			</Box>
		</FormControl>
	);
}
