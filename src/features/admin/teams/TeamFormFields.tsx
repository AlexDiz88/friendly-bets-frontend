import { FormControl, TextField, Typography, Box } from '@mui/material';
import { t } from 'i18next';
import { TeamFormValues } from './teamFormUtils';

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

			<Typography sx={sectionSx}>{t('teamFourScoreSection')}</Typography>
			<Box sx={sectionContentSx}>
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

			<Typography sx={sectionSx}>{t('teamSoccer365Section')}</Typography>
			<Box sx={sectionContentSx}>
				<TextField
					fullWidth
					size="small"
					sx={fieldSx}
					id="soccer365-external-name"
					label={t('teamSoccer365ExternalName')}
					variant="outlined"
					value={values.soccer365ExternalName}
					onChange={(e) => onChange({ soccer365ExternalName: e.target.value })}
				/>
			</Box>
		</FormControl>
	);
}
