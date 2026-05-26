import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';
import { isTeamFormComplete, TeamFormValues } from './teamFormUtils';

type TeamFormStatusIconProps = {
	values: TeamFormValues;
};

export default function TeamFormStatusIcon({ values }: TeamFormStatusIconProps): JSX.Element {
	const complete = isTeamFormComplete(values);

	return (
		<Tooltip
			title={complete ? t('teamFormStatusComplete') : t('teamFormStatusIncomplete')}
			arrow
		>
			{complete ? (
				<CheckCircleIcon
					aria-label={t('teamFormStatusComplete')}
					sx={{ ml: 0.75, fontSize: 22, color: 'success.main', flexShrink: 0 }}
				/>
			) : (
				<WarningIcon
					aria-label={t('teamFormStatusIncomplete')}
					sx={{ ml: 0.75, fontSize: 22, color: 'warning.main', flexShrink: 0 }}
				/>
			)}
		</Tooltip>
	);
}
