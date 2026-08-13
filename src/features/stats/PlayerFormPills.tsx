import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { playerFormLabelSx, playerFormPillSx, playerFormRowSx } from './playerStatsChartStyles';
import { type BetFormStatus } from './types/PlayerHighlight';

export const FORM_PILL = {
	dark: {
		WON: { bg: '#166534', fg: '#dcfce7' },
		RETURNED: { bg: '#854d0e', fg: '#fef9c3' },
		LOST: { bg: '#991b1b', fg: '#fee2e2' },
		EMPTY: { bg: '#3f3f46', fg: '#e4e4e7' },
	},
	light: {
		WON: { bg: '#15803d', fg: '#ffffff' },
		RETURNED: { bg: '#ca8a04', fg: '#ffffff' },
		LOST: { bg: '#b91c1c', fg: '#ffffff' },
		EMPTY: { bg: '#64748b', fg: '#ffffff' },
	},
} as const;

const FORM_LETTER_KEY: Record<BetFormStatus, string> = {
	WON: 'statsChart.formWon',
	RETURNED: 'statsChart.formReturned',
	LOST: 'statsChart.formLost',
	EMPTY: 'statsChart.formEmpty',
};

const FORM_TITLE_KEY: Record<BetFormStatus, string> = {
	WON: 'statsChart.wonShort',
	RETURNED: 'statsChart.returnedShort',
	LOST: 'statsChart.lostShort',
	EMPTY: 'statsChart.emptyShort',
};

export default function PlayerFormPills({ form }: { form: BetFormStatus[] }): JSX.Element | null {
	const theme = useTheme();
	const palette = theme.palette.mode === 'dark' ? FORM_PILL.dark : FORM_PILL.light;

	if (form.length === 0) {
		return null;
	}

	return (
		<Box>
			<Typography component="div" sx={playerFormLabelSx}>
				{t('statsChart.form')}
			</Typography>
			<Box sx={playerFormRowSx} role="list" aria-label={t('statsChart.form')}>
				{form.map((status, index) => {
					const colors = palette[status];
					return (
						<Box
							key={`${status}-${index}`}
							role="listitem"
							title={t(FORM_TITLE_KEY[status])}
							sx={playerFormPillSx(colors.bg, colors.fg)}
						>
							{t(FORM_LETTER_KEY[status])}
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}
