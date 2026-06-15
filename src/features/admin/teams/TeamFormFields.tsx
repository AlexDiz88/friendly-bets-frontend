import { Box, FormControl, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import UnmappedTeamNameHints from './UnmappedTeamNameHints';
import {
	FOURSCORE_PROVIDER,
	MARATHONBET_PROVIDER,
	ODDS_API_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
} from './teamProviderConstants';
import {
	hasFourScoreApiMapping,
	hasOddsApiMapping,
	hasTwentyFourScoreApiMapping,
	TeamFormValues,
} from './teamFormUtils';

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

			<Typography sx={sectionSx}>{t('teamFourScoreSection')}</Typography>
			<Box sx={sectionContentSx}>
				{!hasFourScoreApiMapping(values) ? (
					<UnmappedTeamNameHints
						provider={FOURSCORE_PROVIDER}
						refreshKey={unmappedHintsRefreshKey}
						onApply={(externalName) => onChange({ fourscoreExternalName: externalName })}
					/>
				) : null}
				<TextField
					fullWidth
					size="small"
					sx={fieldSx}
					id="fourscore-external-name"
					label={t('teamFourScoreExternalName')}
					variant="outlined"
					value={values.fourscoreExternalName}
					onChange={(e) => onChange({ fourscoreExternalName: e.target.value })}
				/>
			</Box>

			<Typography sx={sectionSx}>{t('teamTwentyFourScoreSection')}</Typography>
			<Box sx={sectionContentSx}>
				{!hasTwentyFourScoreApiMapping(values) ? (
					<UnmappedTeamNameHints
						provider={TWENTYFOUR_SCORE_PROVIDER}
						refreshKey={unmappedHintsRefreshKey}
						onApply={(externalName) => onChange({ twentyFourScoreExternalName: externalName })}
					/>
				) : null}
				<TextField
					fullWidth
					size="small"
					sx={fieldSx}
					id="twentyfourscore-external-name"
					label={t('teamTwentyFourScoreExternalName')}
					variant="outlined"
					value={values.twentyFourScoreExternalName}
					onChange={(e) => onChange({ twentyFourScoreExternalName: e.target.value })}
				/>
			</Box>

			<Typography sx={sectionSx}>{t('teamMarathonbetSection')}</Typography>
			<Box sx={sectionContentSx}>
				<TextField
					fullWidth
					size="small"
					sx={fieldSx}
					id="marathonbet-external-name"
					label={t('teamMarathonbetExternalName')}
					variant="outlined"
					value={values.marathonbetExternalName}
					onChange={(e) => onChange({ marathonbetExternalName: e.target.value })}
				/>
			</Box>

			<Typography sx={sectionSx}>{t('teamOddsApiSection')}</Typography>
			<Box sx={sectionContentSx}>
				{!hasOddsApiMapping(values) ? (
					<UnmappedTeamNameHints
						provider={ODDS_API_PROVIDER}
						refreshKey={unmappedHintsRefreshKey}
						onApply={(externalName, externalId) => {
							const patch: Partial<TeamFormValues> = {
								oddsApiExternalName: externalName,
							};
							if (externalId != null) {
								patch.oddsApiTeamId = String(externalId);
							}
							onChange(patch);
						}}
					/>
				) : null}
				<TextField
					fullWidth
					size="small"
					sx={fieldSx}
					id="odds-api-team-id"
					label={t('teamOddsApiId')}
					variant="outlined"
					value={values.oddsApiTeamId}
					onChange={(e) => onChange({ oddsApiTeamId: e.target.value })}
				/>
				<TextField
					fullWidth
					size="small"
					sx={fieldSx}
					id="odds-api-external-name"
					label={t('teamOddsApiExternalName')}
					variant="outlined"
					value={values.oddsApiExternalName}
					onChange={(e) => onChange({ oddsApiExternalName: e.target.value })}
				/>
			</Box>
		</FormControl>
	);
}
